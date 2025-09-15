import { ProductBreadcrumb } from "@/components/layout/product-breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoryDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Category Navigation Demo</h1>
      
      <Tabs defaultValue="breadcrumbs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breadcrumbs">Breadcrumbs</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Menu</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breadcrumbs">
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumb Examples</CardTitle>
              <CardDescription>
                Different breadcrumb configurations for various pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Simple Product Page:</p>
                <ProductBreadcrumb 
                  items={[
                    { label: "Products", href: "/products" },
                    { label: "MacBook Pro 14\"" }
                  ]} 
                />
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Product with Category:</p>
                <ProductBreadcrumb 
                  items={[
                    { label: "Products", href: "/products" },
                    { label: "Laptops", href: "/products?category=laptops" },
                    { label: "Apple MacBook Pro" }
                  ]} 
                />
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Nested Categories:</p>
                <ProductBreadcrumb 
                  items={[
                    { label: "Products", href: "/products" },
                    { label: "Electronics", href: "/products?category=electronics" },
                    { label: "Computers", href: "/products?category=computers" },
                    { label: "Laptops", href: "/products?category=laptops" },
                    { label: "Gaming Laptop X1" }
                  ]} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu Features</CardTitle>
              <CardDescription>
                The category navigation is displayed below the main header
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Desktop Navigation</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Hover over categories to see dropdown menus</li>
                  <li>• Featured categories have special layouts with icons</li>
                  <li>• Electronics category showcases featured sections</li>
                  <li>• Direct links for simple categories</li>
                  <li>• Hot Deals section highlighted in red</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Mobile Navigation</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Dropdown menu with all categories</li>
                  <li>• Nested subcategories with sub-menus</li>
                  <li>• Touch-friendly interface</li>
                  <li>• Collapsible for space efficiency</li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge>8 Main Categories</Badge>
                <Badge variant="secondary">40+ Subcategories</Badge>
                <Badge variant="destructive">Hot Deals Section</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Component Features</CardTitle>
              <CardDescription>
                Technical features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Navigation Menu Component</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Uses Radix UI Navigation Menu</li>
                    <li>✓ Keyboard navigation support</li>
                    <li>✓ Accessible with ARIA attributes</li>
                    <li>✓ Responsive design</li>
                    <li>✓ Smooth animations</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Breadcrumb Component</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Semantic HTML structure</li>
                    <li>✓ ARIA labels for accessibility</li>
                    <li>✓ Home icon for visual clarity</li>
                    <li>✓ Current page indication</li>
                    <li>✓ Flexible item configuration</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Dropdown Menu (Mobile)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Touch-optimized</li>
                    <li>✓ Nested subcategories</li>
                    <li>✓ Portal rendering</li>
                    <li>✓ Accessible on all devices</li>
                    <li>✓ Smooth transitions</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Integration</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Integrated with main navigation</li>
                    <li>✓ Sticky positioning</li>
                    <li>✓ Z-index layering</li>
                    <li>✓ Theme-aware styling</li>
                    <li>✓ TypeScript support</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> The category navigation is now visible on all pages below the main header. 
                  On desktop, it shows as a horizontal navigation menu with dropdowns. 
                  On mobile, it appears as a collapsible dropdown button.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}