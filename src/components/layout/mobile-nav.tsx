"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Package, Tags, Info, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={() => setOpen(false)}
            >
              <Package className="h-6 w-6" />
              <span className="font-bold">TechStore</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8">
          <ul className="space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname?.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
                      isActive 
                        ? "bg-accent text-accent-foreground font-medium" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Additional Mobile Menu Items */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="mb-4 text-sm font-medium">Account</h3>
          
          <SignedIn>
            {/* Show account links when signed in */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3 px-3 py-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">My Account</span>
              </li>
              <li>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                >
                  Account Settings
                </Link>
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            {/* Show auth buttons when signed out */}
            <div className="space-y-3">
              <SignInButton mode="redirect">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <Button 
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Button>
              </SignUpButton>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              >
                Shopping Cart (Guest)
              </Link>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
}