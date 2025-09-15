"use client";

import { useState } from "react";
import ProductSearch, { CommandSearch, SearchDialog, InlineSearch } from "@/components/products/product-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function SearchDemoPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Search Components Demo</h1>
        <p className="text-muted-foreground mb-8">
          Explore different search implementations for the product catalog
        </p>

        <Tabs defaultValue="inline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inline">Inline Search</TabsTrigger>
            <TabsTrigger value="command">Command Palette</TabsTrigger>
            <TabsTrigger value="dialog">Search Dialog</TabsTrigger>
          </TabsList>

          <TabsContent value="inline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inline Search with Dropdown</CardTitle>
                <CardDescription>
                  A search input that shows results in a dropdown panel. Includes search history
                  and real-time suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-md">
                  <InlineSearch 
                    placeholder="Try searching for 'laptop' or 'phone'..."
                    onSearch={(query) => console.log("Searching for:", query)}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Features:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Real-time search as you type</li>
                    <li>• Product and category results</li>
                    <li>• Search history with localStorage</li>
                    <li>• Quick clear button</li>
                    <li>• Keyboard navigation support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Example</CardTitle>
                <CardDescription>
                  Use in navigation bars or sidebars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Navigation Bar</h3>
                    <div className="w-64">
                      <ProductSearch variant="inline" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Perfect for header navigation with instant results
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="command" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Command Palette Search</CardTitle>
                <CardDescription>
                  A powerful command palette interface with keyboard shortcuts.
                  Press <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘K</kbd> or <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl+K</kbd> to open.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommandSearch />
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Features:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Global keyboard shortcut (⌘K / Ctrl+K)</li>
                    <li>• Grouped results (Products, Categories, Suggestions)</li>
                    <li>• Recent searches</li>
                    <li>• Keyboard-first navigation</li>
                    <li>• Fast and responsive</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>
                  Ideal for power users and keyboard-focused navigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <code className="text-sm">
                      {`import { CommandSearch } from "@/components/products/product-search";

<CommandSearch />`}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The command palette automatically registers keyboard shortcuts
                    and handles all search interactions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dialog" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Dialog</CardTitle>
                <CardDescription>
                  A full-featured search dialog with detailed results display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Open Search Dialog
                </Button>
                <SearchDialog open={dialogOpen} onOpenChange={setDialogOpen} />
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Features:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Full-screen modal interface</li>
                    <li>• Detailed product cards with images</li>
                    <li>• Category and brand badges</li>
                    <li>• Manual search trigger</li>
                    <li>• Great for advanced search flows</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use Cases</CardTitle>
                <CardDescription>
                  Best for dedicated search experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Mobile search screens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Advanced search with filters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Search-focused landing pages</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
            <CardDescription>
              Quick start guide for implementing search in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Import the component</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <code className="text-sm">
                    {`import ProductSearch from "@/components/products/product-search";`}
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Choose your variant</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <code className="text-sm">
                    {`// Inline search
<ProductSearch variant="inline" />

// Command palette
<ProductSearch variant="command" />

// Dialog search
<ProductSearch variant="dialog" />`}
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Customize as needed</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <code className="text-sm">
                    {`<ProductSearch 
  variant="inline"
  placeholder="Custom placeholder..."
  onSearch={(query) => handleSearch(query)}
  className="custom-class"
/>`}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}