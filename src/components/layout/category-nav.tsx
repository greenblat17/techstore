"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronRight, Grid3x3, Laptop, Smartphone, Headphones, Monitor, Watch, Camera, Gamepad2 } from "lucide-react";

// Category data structure with subcategories
const categories = [
  {
    id: "electronics",
    name: "Electronics",
    href: "/products?category=electronics",
    icon: Grid3x3,
    description: "Latest gadgets and electronic devices",
    featured: [
      {
        name: "New Arrivals",
        href: "/products?category=electronics&sort=newest",
        description: "Check out the latest electronics",
      },
      {
        name: "Best Sellers",
        href: "/products?category=electronics&sort=bestselling",
        description: "Most popular electronic items",
      },
    ],
    subcategories: [
      { name: "All Electronics", href: "/products?category=electronics" },
      { name: "Deals & Offers", href: "/products?category=electronics&sale=true" },
    ],
  },
  {
    id: "furniture",
    name: "Furniture",
    href: "/products?category=furniture",
    icon: Laptop,
    subcategories: [
      { name: "All Furniture", href: "/products?category=furniture" },
      { name: "Office Chairs", href: "/products?category=furniture" },
      { name: "Desks", href: "/products?category=furniture" },
    ],
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    href: "/products?category=home-kitchen",
    icon: Smartphone,
    subcategories: [
      { name: "All Home & Kitchen", href: "/products?category=home-kitchen" },
      { name: "Kitchen Items", href: "/products?category=home-kitchen" },
      { name: "Home Decor", href: "/products?category=home-kitchen" },
    ],
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    href: "/products?category=sports-fitness",
    icon: Headphones,
    subcategories: [
      { name: "All Sports & Fitness", href: "/products?category=sports-fitness" },
      { name: "Exercise Equipment", href: "/products?category=sports-fitness" },
      { name: "Outdoor Gear", href: "/products?category=sports-fitness" },
    ],
  },
  {
    id: "home-office",
    name: "Home Office",
    href: "/products?category=home-office",
    icon: Monitor,
    subcategories: [
      { name: "All Home Office", href: "/products?category=home-office" },
      { name: "Desk Accessories", href: "/products?category=home-office" },
      { name: "Office Supplies", href: "/products?category=home-office" },
    ],
  },
  {
    id: "bags-luggage",
    name: "Bags & Luggage",
    href: "/products?category=bags-luggage",
    icon: Watch,
    subcategories: [
      { name: "All Bags", href: "/products?category=bags-luggage" },
      { name: "Backpacks", href: "/products?category=bags-luggage" },
      { name: "Travel Bags", href: "/products?category=bags-luggage" },
    ],
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    href: "/products?category=health-wellness",
    icon: Camera,
    subcategories: [
      { name: "All Health & Wellness", href: "/products?category=health-wellness" },
      { name: "Fitness Trackers", href: "/products?category=health-wellness" },
      { name: "Health Monitors", href: "/products?category=health-wellness" },
    ],
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <div className="container">
        <NavigationMenu className="mx-0">
          <NavigationMenuList>
            {/* All Products Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/products" className={navigationMenuTriggerStyle()}>
                  All Products
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Categories with Dropdowns */}
            {categories.map((category) => (
              <NavigationMenuItem key={category.id}>
                {category.featured ? (
                  // Categories with featured sections (like Electronics)
                  <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                ) : category.subcategories.length > 3 ? (
                  // Categories with many subcategories
                  <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                ) : (
                  // Simple categories - direct link
                  <NavigationMenuLink asChild>
                    <Link href={category.href} className={navigationMenuTriggerStyle()}>
                      {category.name}
                    </Link>
                  </NavigationMenuLink>
                )}

                {(category.featured || category.subcategories.length > 3) && (
                  <NavigationMenuContent>
                    <div className="w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px]">
                      {category.featured ? (
                        // Featured layout for main categories
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href={category.href}
                              >
                                <category.icon className="h-6 w-6 mb-2" />
                                <div className="mb-2 text-lg font-medium">
                                  {category.name}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  {category.description}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </div>
                          <div className="space-y-2">
                            {category.featured.map((item) => (
                              <ListItem
                                key={item.name}
                                href={item.href}
                                title={item.name}
                              >
                                {item.description}
                              </ListItem>
                            ))}
                          </div>
                          <div className="col-span-2">
                            <div className="flex flex-col space-y-2">
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                Browse Categories
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {category.subcategories.map((sub) => (
                                  <NavigationMenuLink asChild key={sub.name}>
                                    <a
                                      href={sub.href}
                                      className="text-sm hover:text-primary hover:underline flex items-center"
                                    >
                                      <ChevronRight className="h-3 w-3 mr-1" />
                                      {sub.name}
                                    </a>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Simple grid layout for regular categories
                        <ul className="grid gap-3 md:grid-cols-2">
                          {category.subcategories.map((sub) => (
                            <li key={sub.name}>
                              <ListItem
                                href={sub.href}
                                title={sub.name}
                              >
                                Browse our selection of {sub.name.toLowerCase()}
                              </ListItem>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            ))}

            {/* Sale/Deals Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/products?sale=true" className={cn(navigationMenuTriggerStyle(), "text-red-600 font-semibold")}>
                  🔥 Deals
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}