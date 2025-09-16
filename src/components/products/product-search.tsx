"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Clock,
  X,
  Package,
  Tag,
  ArrowRight,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice: string | null;
  images: string[];
  shortDescription: string | null;
  category: string | null;
  brand: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SearchResult {
  products: Product[];
  categories: Category[];
  suggestions: string[];
}

interface ProductSearchProps {
  variant?: "inline" | "dialog" | "command";
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

// Search History Hook
function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const addToHistory = (query: string) => {
    const newHistory = [query, ...history.filter((h) => h !== query)].slice(
      0,
      5
    );
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return { history, addToHistory, clearHistory };
}

// Product Search Result Component
function ProductSearchResult({ product }: { product: Product }) {
  const discountPercentage = product.salePrice
    ? Math.round(
        ((parseFloat(product.price) - parseFloat(product.salePrice)) /
          parseFloat(product.price)) *
          100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer">
        <div className="w-12 h-12 relative bg-gray-100 rounded">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {product.category && <span>{product.category}</span>}
            {product.brand && <span>• {product.brand}</span>}
          </div>
        </div>
        <div className="text-right">
          {product.salePrice ? (
            <div>
              <span className="text-sm font-semibold">
                ${parseFloat(product.salePrice).toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-sm font-semibold">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Inline Search Component
export function InlineSearch({
  placeholder,
  onSearch,
  className,
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const router = useRouter();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={className}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder || "Search products..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults(null);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query || history.length > 0) && (
        <div className="absolute z-50 mt-2 w-full max-w-2xl bg-background border rounded-lg shadow-lg">
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : results ? (
              <>
                {/* Product Results */}
                {results.products.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      Products
                    </div>
                    {results.products.slice(0, 5).map((product) => (
                      <ProductSearchResult key={product.id} product={product} />
                    ))}
                    {results.products.length > 5 && (
                      <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        className="flex items-center justify-between p-2 text-sm text-primary hover:bg-accent rounded-md"
                      >
                        View all {results.products.length} products
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Category Results */}
                {results.categories.length > 0 && (
                  <>
                    <div className="border-t" />
                    <div className="p-2">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Categories
                      </div>
                      {results.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.id}`}
                          className="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md"
                        >
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* No Results */}
                {results.products.length === 0 &&
                  results.categories.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No results found for &quot;{query}&quot;
                      </p>
                    </div>
                  )}
              </>
            ) : (
              /* Search History */
              history.length > 0 &&
              !query && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        clearHistory();
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  {history.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setQuery(item);
                        handleSearch(item);
                      }}
                      className="flex items-center gap-2 w-full p-2 text-sm text-left hover:bg-accent rounded-md"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {item}
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Command Palette Search
export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { history, addToHistory } = useSearchHistory();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search API call
  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
    if (query) {
      addToHistory(query);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search products...
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products, categories..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <CommandEmpty>
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            </CommandEmpty>
          )}

          {!loading && !query && history.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {history.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => {
                    setQuery(item);
                  }}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && results && (
            <>
              {results.products.length > 0 && (
                <CommandGroup heading="Products">
                  {results.products.slice(0, 5).map((product) => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => handleSelect(`/products/${product.slug}`)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.category} • $
                          {parseFloat(
                            product.salePrice || product.price
                          ).toFixed(2)}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                  {results.products.length > 5 && (
                    <CommandItem
                      onSelect={() =>
                        handleSelect(
                          `/products?search=${encodeURIComponent(query)}`
                        )
                      }
                    >
                      View all {results.products.length} products
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </CommandItem>
                  )}
                </CommandGroup>
              )}

              {results.categories.length > 0 && (
                <CommandGroup heading="Categories">
                  {results.categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      onSelect={() =>
                        handleSelect(`/products?category=${category.id}`)
                      }
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {results.suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      onSelect={() => {
                        setQuery(suggestion);
                      }}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}

          {!loading &&
            results &&
            results.products.length === 0 &&
            results.categories.length === 0 && (
              <CommandEmpty>
                No results found for &quot;{query}&quot;
              </CommandEmpty>
            )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

// Search Dialog Component
export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToHistory } = useSearchHistory();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleProductClick = (slug: string) => {
    addToHistory(query);
    router.push(`/products/${slug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            Find products by name, category, or brand
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {!loading && results && (
            <>
              {results.products.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Found {results.products.length} products
                  </h3>
                  {results.products.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 relative bg-gray-100 rounded">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingCart className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            {product.shortDescription && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.shortDescription}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {product.category && (
                                <Badge variant="outline" className="text-xs">
                                  {product.category}
                                </Badge>
                              )}
                              {product.brand && (
                                <Badge variant="outline" className="text-xs">
                                  {product.brand}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {product.salePrice ? (
                              <>
                                <div className="text-lg font-semibold">
                                  ${parseFloat(product.salePrice).toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground line-through">
                                  ${parseFloat(product.price).toFixed(2)}
                                </div>
                              </>
                            ) : (
                              <div className="text-lg font-semibold">
                                ${parseFloat(product.price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No products found for &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Dialog Search Wrapper Component
function DialogSearchWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

// Main Export - Flexible Search Component
export default function ProductSearch({
  variant = "inline",
  ...props
}: ProductSearchProps) {
  switch (variant) {
    case "command":
      return <CommandSearch />;
    case "dialog":
      return <DialogSearchWrapper />;
    case "inline":
    default:
      return <InlineSearch {...props} />;
  }
}
