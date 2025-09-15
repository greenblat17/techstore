import * as dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from 'crypto';

// Load environment variables from .env.local FIRST before any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import database after env vars are loaded
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { products, customers, adminUsers, carts, cartItems, orderItems, orders, categories } from './schema';

// Set up database connection here in the seed file
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined. Please check your .env.local file.');
}

const isSupabase = connectionString.includes('supabase.co');
const client = postgres(connectionString, { 
  prepare: false,
  ssl: isSupabase ? 'require' : false
});

const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Clear existing data (optional - skip if tables are empty or if flag is set)
    const shouldClear = process.env.CLEAR_DB !== 'false';
    
    if (shouldClear) {
      console.log('Clearing existing data...');
      try {
        // Delete in correct order to respect foreign key constraints
        await db.delete(cartItems);
        await db.delete(carts);
        await db.delete(orderItems);
        await db.delete(orders);
        await db.delete(adminUsers);
        await db.delete(customers);
        await db.delete(products);
        await db.delete(categories);
        console.log('✅ Cleared existing data');
      } catch (clearError) {
        console.log('⚠️  Could not clear data (tables might be empty or have constraints)');
        // Continue with seeding even if clearing fails
      }
    } else {
      console.log('Skipping data clearing...');
    }

    // Seed categories first
    console.log('Seeding categories...');
    const categoryData = [
      {
        id: randomUUID(),
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        displayOrder: 1,
      },
      {
        id: randomUUID(),
        name: 'Furniture',
        slug: 'furniture',
        description: 'Home and office furniture',
        displayOrder: 2,
      },
      {
        id: randomUUID(),
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Home essentials and kitchen items',
        displayOrder: 3,
      },
      {
        id: randomUUID(),
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Sports equipment and fitness gear',
        displayOrder: 4,
      },
      {
        id: randomUUID(),
        name: 'Home & Office',
        slug: 'home-office',
        description: 'Home office supplies and equipment',
        displayOrder: 5,
      },
      {
        id: randomUUID(),
        name: 'Bags & Luggage',
        slug: 'bags-luggage',
        description: 'Bags, backpacks, and travel gear',
        displayOrder: 6,
      },
      {
        id: randomUUID(),
        name: 'Health & Wellness',
        slug: 'health-wellness',
        description: 'Health monitoring and wellness products',
        displayOrder: 7,
      },
    ];

    await db.insert(categories).values(categoryData);
    console.log(`✅ Seeded ${categoryData.length} categories`);

    // Create a map of category names to IDs for product seeding
    const categoryMap = categoryData.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Seed products
    console.log('Seeding products...');
    const productData = [
      {
        id: randomUUID(),
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        shortDescription: 'Premium wireless headphones with noise cancellation',
        price: '89.99',
        salePrice: '79.99',
        sku: 'WBH-001',
        categoryId: categoryMap['electronics'],
        brand: 'AudioTech',
        specifications: { battery: '30 hours', connectivity: 'Bluetooth 5.0', weight: '250g' },
        featured: true,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
        stockQuantity: 50,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'Comfortable office chair with lumbar support and adjustable height.',
        shortDescription: 'Comfortable office chair with lumbar support',
        price: '299.99',
        sku: 'EOC-002',
        categoryId: categoryMap['furniture'],
        brand: 'ComfortSeating',
        images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
        stockQuantity: 25,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Stainless Steel Water Bottle',
        slug: 'stainless-steel-water-bottle',
        description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        shortDescription: 'Insulated water bottle for hot and cold drinks',
        price: '24.99',
        sku: 'SWB-003',
        categoryId: categoryMap['home-kitchen'],
        brand: 'HydroBottle',
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'],
        stockQuantity: 100,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'USB-C Hub 7-in-1',
        slug: 'usb-c-hub-7-in-1',
        description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.',
        shortDescription: 'Multi-port USB-C hub for laptops',
        price: '49.99',
        sku: 'UCH-004',
        categoryId: categoryMap['electronics'],
        brand: 'TechHub',
        featured: true,
        images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80'],
        stockQuantity: 75,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Non-slip yoga mat with extra thickness for comfort during workouts.',
        shortDescription: 'Non-slip premium yoga mat',
        price: '39.99',
        sku: 'YMP-005',
        categoryId: categoryMap['sports-fitness'],
        brand: 'FitGear',
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'],
        stockQuantity: 60,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Smart LED Desk Lamp',
        slug: 'smart-led-desk-lamp',
        description: 'Adjustable LED desk lamp with touch control and multiple brightness levels.',
        shortDescription: 'Smart LED lamp with touch control',
        price: '59.99',
        sku: 'SDL-006',
        categoryId: categoryMap['home-office'],
        brand: 'BrightLight',
        images: ['https://images.unsplash.com/photo-1565636192335-9b45aee44ec5?w=800&q=80'],
        stockQuantity: 40,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Portable Power Bank 20000mAh',
        slug: 'portable-power-bank-20000mah',
        description: 'High-capacity power bank with fast charging and dual USB ports.',
        shortDescription: 'High-capacity portable charger',
        price: '34.99',
        sku: 'PPB-007',
        categoryId: categoryMap['electronics'],
        brand: 'PowerMax',
        images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'],
        stockQuantity: 80,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Ceramic Coffee Mug Set',
        slug: 'ceramic-coffee-mug-set',
        description: 'Set of 4 ceramic coffee mugs with modern design and comfortable handle.',
        shortDescription: 'Modern ceramic coffee mug set',
        price: '29.99',
        sku: 'CCM-008',
        categoryId: categoryMap['home-kitchen'],
        brand: 'CeramicCraft',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
        stockQuantity: 45,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Wireless Mechanical Keyboard',
        slug: 'wireless-mechanical-keyboard',
        description: 'RGB backlit mechanical keyboard with hot-swappable switches.',
        shortDescription: 'RGB mechanical keyboard with hot-swap switches',
        price: '119.99',
        salePrice: '99.99',
        sku: 'WMK-009',
        categoryId: categoryMap['electronics'],
        brand: 'KeyMaster',
        specifications: { switches: 'Hot-swappable', layout: '87-key TKL', connectivity: 'Wireless/USB-C' },
        featured: true,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'],
        stockQuantity: 30,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Canvas Backpack',
        slug: 'canvas-backpack',
        description: 'Durable canvas backpack with laptop compartment and multiple pockets.',
        shortDescription: 'Durable canvas backpack with laptop pocket',
        price: '54.99',
        sku: 'CBP-010',
        categoryId: categoryMap['bags-luggage'],
        brand: 'TravelGear',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
        stockQuantity: 55,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Bamboo Cutting Board Set',
        slug: 'bamboo-cutting-board-set',
        description: 'Set of 3 bamboo cutting boards in different sizes.',
        shortDescription: 'Eco-friendly bamboo cutting board set',
        price: '44.99',
        sku: 'BCB-011',
        categoryId: categoryMap['home-kitchen'],
        brand: 'EcoKitchen',
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'],
        stockQuantity: 35,
        isActive: true,
      },
      {
        id: randomUUID(),
        name: 'Bluetooth Smart Scale',
        slug: 'bluetooth-smart-scale',
        description: 'Smart scale with body composition analysis and mobile app sync.',
        shortDescription: 'Smart scale with app connectivity',
        price: '69.99',
        sku: 'BSS-012',
        categoryId: categoryMap['health-wellness'],
        brand: 'HealthTrack',
        images: ['https://images.unsplash.com/photo-1611077544502-6b5c72c57452?w=800&q=80'],
        stockQuantity: 20,
        isActive: true,
      },
    ];

    await db.insert(products).values(productData);
    console.log(`✅ Seeded ${productData.length} products`);

    // Seed test customer (you'll need to create this user in Clerk first)
    console.log('Seeding test customer...');
    const testCustomer = {
      id: randomUUID(),
      clerkId: 'user_test_001', // Replace with actual Clerk ID after creating user
      email: 'customer@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    };

    await db.insert(customers).values(testCustomer);
    console.log('✅ Seeded test customer');

    // Seed admin user (you'll need to create this user in Clerk first)
    console.log('Seeding admin user...');
    const testAdmin = {
      id: randomUUID(),
      clerkId: 'user_admin_001', // Replace with actual Clerk ID after creating admin
      email: 'admin@example.com',
      role: 'admin' as const,
      permissions: ['products:manage', 'orders:manage', 'users:manage'],
    };

    await db.insert(adminUsers).values(testAdmin);
    console.log('✅ Seeded admin user');

    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('🎉 Database seeded!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to seed database:', error);
    process.exit(1);
  });