import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShoppingCart, 
  Users, 
  Award, 
  Truck, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  Globe,
  Headphones
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          About TechStore
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted partner for premium technology products and exceptional customer service since 2024.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-16">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At TechStore, we're dedicated to bringing you the latest and greatest in technology 
                at competitive prices. We believe that everyone should have access to quality electronics 
                that enhance their daily lives.
              </p>
              <p className="text-muted-foreground mb-6">
                Our commitment goes beyond just selling products. We strive to provide expert guidance, 
                exceptional support, and a seamless shopping experience that keeps our customers coming back.
              </p>
              <Button asChild size="lg">
                <Link href="/products">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mb-2 mx-auto text-primary" />
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 mb-2 mx-auto text-primary" />
                  <div className="text-2xl font-bold">5★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 mb-2 mx-auto text-primary" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Countries Served</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-8 w-8 mb-2 mx-auto text-primary" />
                  <div className="text-2xl font-bold">1K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose TechStore?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fast & Free Shipping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Free shipping on orders over $50. Most orders delivered within 2-3 business days.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure Shopping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your information is protected with industry-standard SSL encryption and secure payment processing.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>30-Day Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Quality Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We partner with trusted brands and thoroughly test products to ensure the highest quality.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Headphones className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Expert Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our knowledgeable support team is available 24/7 to help with any questions or concerns.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Warranty Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Extended warranty options available on all products for your peace of mind.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Story */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="text-2xl">Our Story</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground">
          <p>
            Founded in 2024, TechStore began with a simple mission: to make quality technology 
            accessible to everyone. What started as a small online shop has grown into a trusted 
            destination for tech enthusiasts and everyday consumers alike.
          </p>
          <p>
            We've built our reputation on three core principles: competitive pricing, exceptional 
            customer service, and a carefully curated selection of products. Every item in our 
            inventory is chosen based on quality, innovation, and value.
          </p>
          <p>
            As we continue to grow, our commitment to our customers remains unchanged. We're not 
            just selling products; we're building relationships and helping people discover technology 
            that improves their lives.
          </p>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our wide selection of electronics, from the latest smartphones to cutting-edge 
          smart home devices. Find exactly what you're looking for at prices you'll love.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">
              Browse Products
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/categories">
              Shop by Category
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}