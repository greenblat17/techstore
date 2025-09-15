"use client";

import * as React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Grid3x3 } from "lucide-react";

const categories = [
  {
    name: "Electronics",
    href: "/products?category=electronics",
    subcategories: [
      { name: "All Electronics", href: "/products?category=electronics" },
      { name: "Deals & Offers", href: "/products?category=electronics&sale=true" },
    ],
  },
  {
    name: "Furniture",
    href: "/products?category=furniture",
    subcategories: [
      { name: "All Furniture", href: "/products?category=furniture" },
      { name: "Office Chairs", href: "/products?category=furniture" },
      { name: "Desks", href: "/products?category=furniture" },
    ],
  },
  {
    name: "Home & Kitchen",
    href: "/products?category=home-kitchen",
    subcategories: [
      { name: "All Home & Kitchen", href: "/products?category=home-kitchen" },
      { name: "Kitchen Items", href: "/products?category=home-kitchen" },
      { name: "Home Decor", href: "/products?category=home-kitchen" },
    ],
  },
  {
    name: "Sports & Fitness",
    href: "/products?category=sports-fitness",
    subcategories: [
      { name: "All Sports & Fitness", href: "/products?category=sports-fitness" },
      { name: "Exercise Equipment", href: "/products?category=sports-fitness" },
      { name: "Outdoor Gear", href: "/products?category=sports-fitness" },
    ],
  },
  {
    name: "Home Office",
    href: "/products?category=home-office",
    subcategories: [
      { name: "All Home Office", href: "/products?category=home-office" },
      { name: "Desk Accessories", href: "/products?category=home-office" },
      { name: "Office Supplies", href: "/products?category=home-office" },
    ],
  },
  {
    name: "Bags & Luggage",
    href: "/products?category=bags-luggage",
    subcategories: [
      { name: "All Bags", href: "/products?category=bags-luggage" },
      { name: "Backpacks", href: "/products?category=bags-luggage" },
      { name: "Travel Bags", href: "/products?category=bags-luggage" },
    ],
  },
  {
    name: "Health & Wellness",
    href: "/products?category=health-wellness",
    subcategories: [
      { name: "All Health & Wellness", href: "/products?category=health-wellness" },
      { name: "Fitness Trackers", href: "/products?category=health-wellness" },
      { name: "Health Monitors", href: "/products?category=health-wellness" },
    ],
  },
];

export function MobileCategoryNav() {
  return (
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center">
              <Grid3x3 className="mr-2 h-4 w-4" />
              Browse Categories
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Shop by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* All Products */}
          <DropdownMenuItem asChild>
            <Link href="/products">All Products</Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Categories with subcategories */}
          {categories.map((category) => (
            <DropdownMenuSub key={category.name}>
              <DropdownMenuSubTrigger>
                {category.name}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href={category.href}>
                      All {category.name}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {category.subcategories.map((sub) => (
                    <DropdownMenuItem key={sub.name} asChild>
                      <Link href={sub.href}>{sub.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Deals */}
          <DropdownMenuItem asChild>
            <Link href="/products?sale=true" className="text-red-600 font-semibold">
              🔥 Hot Deals
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}