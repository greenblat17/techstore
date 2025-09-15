# 🛍️ TechStore - Simple E-commerce Platform

## 📋 Project Overview

**Product**: TechStore - Electronics e-commerce website  
**Goal**: Demonstrate full-stack development skills for client portfolio  
**Architecture**: Simple Backend + Frontend (no external services)  
**Timeline**: 2-3 weeks development

---

## 🎯 Core Features

### **Customer Features**
- Browse products with search and filters
- User registration and login
- Shopping cart management
- Order placement and history
- Product reviews and ratings
- User profile management

### **Admin Features**
- Product management (CRUD)
- Order management and tracking
- User management
- Analytics dashboard
- Category and brand management

---

## 🎯 User Stories & Use Cases

### **Epic 1: User Authentication & Management**

**UC-001: User Registration**
```
As a new visitor
I want to create an account
So that I can make purchases and track my orders

Acceptance Criteria:
- Registration form with email, password, name, phone
- Email validation and uniqueness check
- Password strength requirements (min 8 chars, 1 number, 1 special char)
- Automatic login after successful registration
- Email confirmation (console log for demo)
- Input validation with clear error messages
```

**UC-002: User Login**
```
As a registered user
I want to log into my account
So that I can access my profile and order history

Acceptance Criteria:
- Login form with email and password
- JWT token generation and storage
- "Remember me" functionality
- Password reset option (demo with console log)
- Redirect to intended page after login
- Secure password handling
```

**UC-003: Profile Management**
```
As a logged-in user
I want to manage my profile information
So that I can keep my details up to date

Acceptance Criteria:
- View and edit personal information
- Change password functionality
- Upload profile picture
- Update shipping addresses
- View account creation date and activity
```

### **Epic 2: Product Catalog & Discovery**

**UC-004: Browse Products**
```
As a customer
I want to browse available products
So that I can discover items to purchase

Acceptance Criteria:
- Display products in grid/list layout
- Show product image, name, price, rating
- Pagination (20 products per page)
- Category-based navigation
- Featured products section
- Product availability indication
- Quick "Add to Cart" buttons
```

**UC-005: Search Products**
```
As a customer
I want to search for specific products
So that I can quickly find what I'm looking for

Acceptance Criteria:
- Search bar in header on all pages
- Search by product name and description
- Display search results count
- Highlight search terms in results
- Show "no results" message when applicable
- Save recent searches (local storage)
```

**UC-006: Filter & Sort Products**
```
As a customer
I want to filter and sort products
So that I can narrow down options to my preferences

Acceptance Criteria:
- Filter by price range (slider)
- Filter by category and brand
- Filter by rating (4+ stars, 3+ stars, etc.)
- Filter by availability (in stock)
- Sort by price (low to high, high to low)
- Sort by rating, newest, popularity
- Clear all filters option
- Show active filter count
```

**UC-007: View Product Details**
```
As a customer
I want to see detailed product information
So that I can make an informed purchase decision

Acceptance Criteria:
- High-quality product images with zoom
- Complete product description
- Technical specifications
- Price and discount information
- Stock availability
- Customer reviews and ratings
- Related/recommended products
- Add to cart and buy now options
```

### **Epic 3: Shopping Cart & Checkout**

**UC-008: Manage Shopping Cart**
```
As a customer
I want to add products to my cart and manage them
So that I can purchase multiple items together

Acceptance Criteria:
- Add products to cart from any page
- View cart with all items and details
- Update item quantities
- Remove items from cart
- Calculate subtotal and total
- Cart persists between sessions
- Cart icon shows item count
- Continue shopping option
```

**UC-009: Checkout Process**
```
As a customer
I want to complete my purchase
So that I can receive the products I want

Acceptance Criteria:
- Review all cart items and totals
- Enter shipping address information
- Select payment method (demo: Cash on Delivery)
- Add order notes/special instructions
- Confirm order details before submission
- Generate unique order number
- Order confirmation message
- Email confirmation (console log for demo)
```

**UC-010: Order History**
```
As a customer
I want to view my past orders
So that I can track my purchases and reorder items

Acceptance Criteria:
- List all previous orders with details
- Show order status (pending, processing, shipped, delivered)
- View individual order details
- Download order receipts (demo)
- Reorder functionality
- Filter orders by status and date
```

### **Epic 4: Product Reviews & Ratings**

**UC-011: Write Product Reviews**
```
As a customer who purchased a product
I want to write a review and rating
So that I can share my experience with other customers

Acceptance Criteria:
- Rate products from 1 to 5 stars
- Write detailed review with title and comment
- Only registered users can review
- One review per user per product
- Edit and delete own reviews
- Review appears after submission
```

**UC-012: Read Product Reviews**
```
As a customer
I want to read product reviews from other customers
So that I can make better purchase decisions

Acceptance Criteria:
- Display average rating and total review count
- Show individual reviews with rating and date
- Sort reviews by newest, oldest, highest rated
- Pagination for reviews if many exist
- Helpful review indicators
```

### **Epic 5: Admin Management**

**UC-013: Product Management**
```
As an admin
I want to manage the product catalog
So that I can maintain accurate product information

Acceptance Criteria:
- View all products in admin dashboard
- Add new products with all details
- Edit existing product information
- Upload and manage product images
- Set product status (active/inactive/draft)
- Manage stock quantities
- Bulk operations (delete, update status)
- Export product data to CSV
```

**UC-014: Order Management**
```
As an admin
I want to manage customer orders
So that I can process and fulfill them efficiently

Acceptance Criteria:
- View all orders with status and details
- Update order status (pending → processing → shipped → delivered)
- View customer information for each order
- Search orders by customer, date, or order number
- Print order details and shipping labels (demo)
- Send status update notifications (console log)
```

**UC-015: User Management**
```
As an admin
I want to manage user accounts
So that I can provide customer support and maintain security

Acceptance Criteria:
- View all registered users
- Search users by name or email
- View user order history
- Activate/deactivate user accounts
- Reset user passwords if needed
- View user registration statistics
```

**UC-016: Analytics Dashboard**
```
As an admin
I want to view business analytics
So that I can make informed decisions

Acceptance Criteria:
- Total products, users, and orders count
- Revenue statistics (daily, weekly, monthly)
- Top-selling products
- Recent orders and activities
- User registration trends
- Low stock alerts
```

### **Epic 6: Category & Brand Management**

**UC-017: Manage Categories**
```
As an admin
I want to organize products into categories
So that customers can easily find related items

Acceptance Criteria:
- Create, edit, and delete product categories
- Set category names and descriptions
- Upload category images
- Organize categories hierarchically (parent/child)
- Set category display order
- Activate/deactivate categories
```

**UC-018: Browse by Category**
```
As a customer
I want to browse products by category
So that I can find specific types of products easily

Acceptance Criteria:
- Category navigation menu
- Category pages showing relevant products
- Breadcrumb navigation
- Category descriptions and images
- Product count per category
- Subcategory support
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🛍️ Customer App              🔧 Admin Panel               │
│  ├── Product Catalog          ├── Product Management       │
│  ├── Shopping Cart            ├── Order Management         │
│  ├── User Authentication      ├── User Management          │
│  ├── Order Checkout           ├── Analytics Dashboard      │
│  ├── Order History            └── Settings                 │
│  └── User Profile                                          │
│                                                             │
└──────────────────────────┬────────────────────────────────┘
                           │ REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🛡️ API Layer                  📁 File Storage             │
│  ├── Authentication           ├── Product Images           │
│  ├── Product Routes           └── User Avatars             │
│  ├── User Routes                                           │
│  ├── Cart Routes              🧠 Business Logic            │
│  ├── Order Routes             ├── User Management          │
│  └── Admin Routes             ├── Product Catalog          │
│                               ├── Cart Operations          │
│  📊 Database (PostgreSQL)     ├── Order Processing         │
│  ├── users                    └── Analytics               │
│  ├── products                                             │
│  ├── categories                                           │
│  ├── orders                                               │
│  ├── cart_items                                           │
│  └── reviews                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' or 'admin'
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    brand VARCHAR(100),
    images TEXT[], -- Array of image URLs
    specifications JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'draft'
    featured BOOLEAN DEFAULT FALSE,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Database indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
```

---

## 💻 Technology Stack

### **Frontend**
- **React 18** - User interface library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **React Query** - Server state management

### **Backend**
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing

### **Development Tools**
- **Git** - Version control
- **Postman** - API testing
- **pgAdmin** - Database management
- **VS Code** - Code editor

---

## 🎨 User Interface Design

### **Homepage Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ 🏠 TechStore    🔍 [Search...]    🛒 Cart(2)  👤 Login     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               🎯 Hero Section                               │
│        ┌─────────────────────────────────────┐             │
│        │     Latest iPhone 15 Pro            │             │
│        │     Starting at $999                │             │
│        │     [Shop Now]                      │             │
│        └─────────────────────────────────────┘             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               📱 Shop by Category                           │
│   [📱 Phones] [💻 Laptops] [🎧 Headphones] [⌚ Watches]    │
│   [📺 TVs]    [🎮 Gaming]  [📷 Cameras]    [🔋 Accessories]│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               🔥 Featured Products                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │  📱     │  │  💻     │  │  🎧     │  │  ⌚     │      │
│  │ iPhone  │  │ MacBook │  │ AirPods │  │ Apple   │      │
│  │  $999   │  │ $1299   │  │  $249   │  │ Watch   │      │
│  │ ⭐ 4.8  │  │ ⭐ 4.9  │  │ ⭐ 4.7  │  │  $399   │      │
│  └─────────┘  └─────────┘  └─────────┘  │ ⭐ 4.6  │      │
│                                         └─────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### **Product Catalog Page**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search: "smartphones" (24 results)    [Grid][List] Sort▼ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Filters              │        Products                    │
│ ┌─────────────────────┤                                   │
│ │ 💰 Price Range      │  ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ $0 ═════●═══ $2000  │  │ 📱   │ │ 📱   │ │ 📱   │      │
│ │                     │  │$1099 │ │ $899 │ │ $699 │      │
│ │ 📱 Categories       │  │⭐4.8 │ │⭐4.6 │ │⭐4.5 │      │
│ │ ☑ Smartphones       │  │[Cart]│ │[Cart]│ │[Cart]│      │
│ │ ☐ Tablets           │  └──────┘ └──────┘ └──────┘      │
│ │                     │                                   │
│ │ 🏷️ Brands           │  ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ ☑ Apple             │  │ 📱   │ │ 📱   │ │ 📱   │      │
│ │ ☐ Samsung           │  │ $599 │ │ $499 │ │ $399 │      │
│ │ ☐ Google            │  │⭐4.4 │ │⭐4.3 │ │⭐4.2 │      │
│ │                     │  │[Cart]│ │[Cart]│ │[Cart]│      │
│ │ ⭐ Rating           │  └──────┘ └──────┘ └──────┘      │
│ │ ☑ 4+ stars          │                                   │
│ │ ☐ 3+ stars          │         [Load More...]            │
│ └─────────────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

### **Admin Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔧 Admin Dashboard                          👤 Admin ▼     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           📊 Overview Stats                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 📦 Products │ │ 👥 Users    │ │ 💰 Revenue  │          │
│  │    1,247    │ │    342      │ │   $25,430   │          │
│  │   +12 today │ │  +5 today   │ │  +$1,200    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 Recent Orders                    🎯 Quick Actions      │
│  #ORD-001 John Doe    $299.99 ✅    [➕ Add Product]      │
│  #ORD-002 Jane Smith  $199.99 📦    [📦 View Orders]      │
│  #ORD-003 Bob Johnson $499.99 ⏳    [👥 Manage Users]     │
│  #ORD-004 Alice Brown $149.99 ✅    [📊 View Analytics]   │
│                                                             │
│  [View All Orders]                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Feature Implementation Plan

### **Week 1: Foundation**

#### **Day 1-2: Project Setup**
- Initialize React + Node.js project
- Set up PostgreSQL database
- Create basic project structure
- Set up development environment

#### **Day 3-4: Authentication System**
- User registration and login
- JWT token implementation
- Protected routes
- Password hashing with bcrypt

#### **Day 5-7: Product Catalog**
- Product model and database schema
- Basic CRUD operations for products
- Product listing page
- Product detail page

### **Week 2: Core Features**

#### **Day 8-9: Shopping Cart**
- Cart functionality (add, remove, update)
- Cart persistence
- Cart UI components
- Guest cart handling

#### **Day 10-11: Order System**
- Order placement workflow
- Order management
- Order history for users
- Order status tracking

#### **Day 12-14: Admin Panel**
- Admin authentication
- Product management interface
- Order management dashboard
- User management system

### **Week 3: Polish & Deployment**

#### **Day 15-16: Advanced Features**
- Search functionality
- Product filtering and sorting
- Review system
- User profile management

#### **Day 17-18: UI/UX Enhancement**
- Responsive design
- Loading states
- Error handling
- Form validations

#### **Day 19-21: Testing & Deployment**
- Bug fixes and testing
- Performance optimization
- Deployment setup
- Documentation

---

## 🔌 API Endpoints

### **Authentication**
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
GET  /api/auth/profile      - Get user profile
PUT  /api/auth/profile      - Update user profile
```

### **Products**
```
GET    /api/products              - Get all products (with filters)
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product (admin only)
PUT    /api/products/:id          - Update product (admin only)
DELETE /api/products/:id          - Delete product (admin only)
GET    /api/products/search?q=... - Search products
```

### **Categories**
```
GET    /api/categories     - Get all categories
POST   /api/categories     - Create category (admin only)
PUT    /api/categories/:id - Update category (admin only)
DELETE /api/categories/:id - Delete category (admin only)
```

### **Shopping Cart**
```
GET    /api/cart           - Get user's cart
POST   /api/cart/add       - Add item to cart
PUT    /api/cart/:id       - Update cart item
DELETE /api/cart/:id       - Remove cart item
DELETE /api/cart/clear     - Clear entire cart
```

### **Orders**
```
GET  /api/orders          - Get user's orders
POST /api/orders          - Create new order
GET  /api/orders/:id      - Get single order
PUT  /api/orders/:id      - Update order status (admin only)
```

### **Reviews**
```
GET    /api/products/:id/reviews - Get product reviews
POST   /api/products/:id/reviews - Add product review
PUT    /api/reviews/:id          - Update review
DELETE /api/reviews/:id          - Delete review
```

### **Admin**
```
GET /api/admin/stats      - Dashboard statistics
GET /api/admin/orders     - All orders management
GET /api/admin/users      - User management
```

---

## 🚀 Deployment Strategy

### **Development Environment**
```bash
# Backend setup
cd backend
npm install
npm run dev        # Starts on port 5000

# Frontend setup  
cd frontend
npm install
npm run dev        # Starts on port 3000

# Database
createdb techstore
npm run migrate    # Run database migrations
npm run seed       # Add sample data
```

### **Production Deployment**
```bash
# Build frontend
npm run build

# Start backend
npm start

# Database setup
# Run migrations on production database
# Configure environment variables
```

### **Environment Variables**
```env
# Backend (.env)
DATABASE_URL=postgresql://username:password@localhost/techstore
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📊 Success Metrics

### **Technical Goals**
- ✅ Page load time < 3 seconds
- ✅ Mobile-responsive design
- ✅ Cross-browser compatibility
- ✅ SEO-friendly URLs
- ✅ Secure authentication

### **Functional Goals**
- ✅ Complete user registration/login flow
- ✅ Full shopping cart functionality
- ✅ Order management system
- ✅ Admin product management
- ✅ Search and filter products

### **Business Value**
- ✅ Professional e-commerce demo
- ✅ Modern tech stack showcase
- ✅ Clean, maintainable codebase
- ✅ Scalable architecture
- ✅ Client presentation ready

---

## 🎯 Project Benefits

### **For Client Demonstration**
This project shows you can build:
- **Complete e-commerce solution** from scratch
- **Modern tech stack** with React + Node.js
- **Database design** and management
- **User authentication** and authorization
- **Admin functionality** for content management
- **Responsive design** for all devices

### **Development Skills Showcased**
- Full-stack JavaScript development
- RESTful API design and implementation
- Database schema design and optimization
- Modern React patterns and hooks
- State management and data flow
- Authentication and security best practices
- Clean code and project organization

### **Why This Approach Works**
- **Self-contained** - No external dependencies
- **Quick setup** - Standard Node.js + PostgreSQL
- **Cost-effective** - Can run on basic hosting
- **Maintainable** - Clean, simple architecture
- **Expandable** - Easy to add new features
- **Professional** - Production-quality code standards

This TechStore project perfectly demonstrates your ability to build modern, full-stack e-commerce applications while keeping things simple and focused on core functionality.