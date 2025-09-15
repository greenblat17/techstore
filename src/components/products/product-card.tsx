"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, Package } from "lucide-react";
import { PriceDisplay } from "./price-display";
import { StockBadge } from "./stock-badge";
import { StarRating } from "./star-rating";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: string;
  salePrice?: string | null;
  sku: string;
  stockQuantity?: number | null;
  brand?: string | null;
  images?: string[] | null;
  featured?: boolean | null;
  ratingAverage?: string | null;
  ratingCount?: number | null;
  categoryId?: string | null;
  status?: string | null;
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  showQuickActions?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  variant = "default",
  showQuickActions = true,
  className = ""
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.stockQuantity || product.stockQuantity === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.salePrice || product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      image: product.images?.[0] || "",
      quantity: 1,
      stockQuantity: product.stockQuantity || 0,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log("Quick view for:", product.name);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const imageUrl = product.images?.[0] || "";
  const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;
  const isLowStock = product.stockQuantity && product.stockQuantity > 0 && product.stockQuantity <= 5;

  if (variant === "compact") {
    return (
      <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
        <Link href={`/products/${product.slug}`}>
          <div className="flex gap-4 p-4">
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Package className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <PriceDisplay
                price={product.price}
                salePrice={product.salePrice}
                size="sm"
                className="mt-1"
              />
              <StockBadge 
                stockQuantity={product.stockQuantity || 0}
                size="sm"
                className="mt-1"
              />
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg border-border bg-card ${className}`}>
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Package className="h-12 w-12" />
              </div>
            )}
            
            {/* Quick Actions Overlay */}
            {showQuickActions && (
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 pointer-events-auto">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex-1 backdrop-blur-sm"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="backdrop-blur-sm"
                    onClick={handleQuickView}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="backdrop-blur-sm"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between">
              {isLowStock && (
                <StockBadge 
                  stockQuantity={product.stockQuantity || 0}
                  showOnlyLowStock
                  size="sm"
                />
              )}
              {product.featured && (
                <Badge className="bg-accent text-accent-foreground ml-auto">
                  Featured
                </Badge>
              )}
            </div>

            {/* Sale Badge */}
            {product.salePrice && (
              <PriceDisplay
                price={product.price}
                salePrice={product.salePrice}
                showBadgeOnly
                className="absolute top-3 right-3"
              />
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        {product.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-base mb-2 text-card-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {variant === "detailed" && product.shortDescription && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <PriceDisplay
          price={product.price}
          salePrice={product.salePrice}
          className="mb-2"
        />

        {product.ratingAverage && Number(product.ratingAverage) > 0 && (
          <StarRating
            rating={Number(product.ratingAverage)}
            count={product.ratingCount || 0}
            size="sm"
          />
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full transition-all" 
          variant={isOutOfStock ? "secondary" : "outline"}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}