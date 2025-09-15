"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, X, ChevronDown } from "lucide-react";

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface Brand {
  name: string;
  count: number;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  rating: number | null;
  sortBy: string;
}

interface ProductFiltersProps {
  categories?: Category[];
  brands?: Brand[];
  maxPrice?: number;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  totalProducts?: number;
  isMobile?: boolean;
}

// Desktop Filter Sidebar Component
export function ProductFiltersSidebar({
  categories = [],
  brands = [],
  maxPrice = 1000,
  onFiltersChange,
  onReset,
  totalProducts = 0,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, maxPrice],
    inStock: false,
    rating: null,
    sortBy: "newest",
  });

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  const handleStockToggle = () => {
    setFilters(prev => ({
      ...prev,
      inStock: !prev.inStock,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? null : rating,
    }));
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      inStock: false,
      rating: null,
      sortBy: "newest",
    });
    onReset();
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.inStock ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {activeFilterCount} active
            </p>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Sort By */}
      <div className="space-y-3">
        <Label htmlFor="sort-select" className="text-base font-medium">
          Sort By
        </Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
        >
          <SelectTrigger id="sort-select" className="w-full">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="bestselling">Best Selling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      {categories.length > 0 && (
        <>
          <div className="space-y-3">
            <Label className="text-base font-medium">Categories</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category.name}
                    <span className="text-muted-foreground ml-1">
                      ({category.productCount})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={maxPrice}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">
              ${filters.priceRange[0]}
            </span>
            <span className="text-sm text-muted-foreground">
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <>
          <div className="space-y-3">
            <Label className="text-base font-medium">Brands</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.name}`}
                    checked={filters.brands.includes(brand.name)}
                    onCheckedChange={() => handleBrandToggle(brand.name)}
                  />
                  <Label
                    htmlFor={`brand-${brand.name}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {brand.name}
                    <span className="text-muted-foreground ml-1">
                      ({brand.count})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Customer Rating</Label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={() => handleRatingChange(rating)}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm font-normal cursor-pointer flex items-center"
              >
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </span>
                <span className="ml-1">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Availability</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={handleStockToggle}
          />
          <Label
            htmlFor="in-stock"
            className="text-sm font-normal cursor-pointer"
          >
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-base font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map(catId => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <Badge key={catId} variant="secondary" className="gap-1">
                    {category.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCategoryToggle(catId)}
                    />
                  </Badge>
                ) : null;
              })}
              {filters.brands.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleBrandToggle(brand)}
                  />
                </Badge>
              ))}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="gap-1">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handlePriceChange([0, maxPrice])}
                  />
                </Badge>
              )}
              {filters.rating && (
                <Badge variant="secondary" className="gap-1">
                  {filters.rating}★ & up
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRatingChange(filters.rating!)}
                  />
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="gap-1">
                  In Stock
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={handleStockToggle}
                  />
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Mobile Filter Sheet Component
export function ProductFiltersMobile({
  categories = [],
  brands = [],
  maxPrice = 1000,
  onFiltersChange,
  onReset,
  totalProducts = 0,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Narrow down your search from {totalProducts} products
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ProductFiltersSidebar
            categories={categories}
            brands={brands}
            maxPrice={maxPrice}
            onFiltersChange={onFiltersChange}
            onReset={() => {
              onReset();
              setOpen(false);
            }}
            totalProducts={totalProducts}
          />
        </div>
        <div className="mt-6 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Combined Export for easy usage
export default function ProductFilters(props: ProductFiltersProps & { mobile?: boolean }) {
  if (props.mobile) {
    return <ProductFiltersMobile {...props} />;
  }
  return <ProductFiltersSidebar {...props} />;
}