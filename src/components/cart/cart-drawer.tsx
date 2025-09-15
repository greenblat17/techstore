"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  trigger?: React.ReactNode;
}

export function CartDrawer({ trigger }: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalItems,
    isLoading 
  } = useCartStore();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: string, itemName: string) => {
    try {
      await removeItem(itemId);
      toast({
        title: "Item removed",
        description: `${itemName} has been removed from your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                variant="destructive"
              >
                {totalItems}
              </Badge>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center gap-2">
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems} items</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {totalItems > 0 
              ? "Review your items and proceed to checkout"
              : "Your cart is empty"
            }
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 pr-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items to get started
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => {
                  const itemPrice = item.salePrice ?? item.price;
                  
                  return (
                    <div key={item.id} className="space-y-3">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted">
                              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col gap-1">
                          <Link
                            href={`/products/${item.productId}`}
                            onClick={() => setOpen(false)}
                            className="text-sm font-medium hover:underline line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          
                          <div className="flex items-center gap-2">
                            {item.salePrice ? (
                              <>
                                <span className="text-sm font-semibold text-green-600">
                                  {formatPrice(item.salePrice)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatPrice(item.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isLoading}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={
                                (item.stockQuantity !== undefined && 
                                 item.quantity >= item.stockQuantity) || 
                                isLoading
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.stockQuantity !== undefined && 
                       item.stockQuantity <= 5 && 
                       item.stockQuantity > 0 && (
                        <p className="text-xs text-orange-500">
                          Only {item.stockQuantity} left in stock
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pr-6">
              <Separator />
              
              {/* Summary */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
              </div>

              {/* Actions */}
              <SheetFooter className="gap-2 sm:space-x-0">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button 
                  className="w-full" 
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}