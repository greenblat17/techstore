"use client";

import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, Package, Home, LogIn, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { CategoryNav } from "./category-nav";
import { MobileCategoryNav } from "./mobile-category-nav";
import { CartButton } from "@/components/cart/cart-button";
import { ThemeToggle } from "./theme-toggle";

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
        {/* Mobile Navigation */}
        <MobileNav />
        
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            TechStore
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`transition-colors hover:text-foreground/80 ${
              pathname?.startsWith("/products") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className={`transition-colors hover:text-foreground/80 ${
              pathname?.startsWith("/categories") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/about" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart Button */}
          <CartButton />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication */}
          <SignedIn>
            {/* User Account - shown when signed in */}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            {/* Auth buttons - shown when signed out */}
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="hidden sm:flex">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </SignUpButton>
              {/* Mobile auth buttons */}
              <div className="flex sm:hidden">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="icon">
                    <LogIn className="h-5 w-5" />
                    <span className="sr-only">Sign In</span>
                  </Button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
      
      {/* Category Navigation */}
      <div className="sticky top-16 z-40 bg-background border-b">
        {/* Desktop Category Navigation */}
        <div className="hidden lg:block">
          <CategoryNav />
        </div>
        
        {/* Mobile Category Navigation */}
        <div className="lg:hidden container py-2">
          <MobileCategoryNav />
        </div>
      </div>
    </>
  );
}