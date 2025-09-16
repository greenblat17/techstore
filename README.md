# TechStore - Modern E-Commerce Platform

A full-featured e-commerce platform built with Next.js 15, React 19, and TypeScript. This project demonstrates a production-ready online store with modern UI/UX, secure authentication, and comprehensive admin capabilities.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Category Navigation**: Organized product categories with subcategories
- **Shopping Cart**: Persistent cart with real-time updates
- **User Authentication**: Secure sign-up/sign-in with Clerk
- **Dark Mode**: System-aware theme switching
- **Responsive Design**: Mobile-first, fully responsive UI
- **Product Details**: Detailed product pages with images and specifications
- **Order Management**: Track order history and status

### Admin Features
- **Product Management**: Add, edit, delete products
- **Order Processing**: Manage customer orders
- **User Management**: View and manage customer accounts
- **Category Management**: Organize product categories
- **Analytics Dashboard**: Sales and performance metrics
- **Inventory Tracking**: Stock management system

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.5](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI based)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- **Fonts**: Geist font family via next/font

### Backend & Database
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- **Database**: PostgreSQL (Supabase compatible)
- **Authentication**: [Clerk](https://clerk.dev/)
- **API**: Next.js API Routes (RESTful)

### State Management & Forms
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) with persistence
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

### Development Tools
- **Language**: TypeScript with strict mode
- **Linting**: ESLint
- **Package Manager**: npm

## 📁 Project Structure

```
techstore/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── (shop)/          # Shop pages group
│   │   ├── admin/           # Admin dashboard
│   │   ├── sign-in/         # Authentication pages
│   │   └── sign-up/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── products/        # Product components
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout components
│   │   └── admin/           # Admin components
│   ├── lib/                 # Utilities and configs
│   │   ├── db/              # Database schema & connection
│   │   ├── api/             # API utilities
│   │   └── utils/           # Helper functions
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   └── hooks/               # Custom React hooks
├── drizzle/                 # Database migrations
├── public/                  # Static assets
└── ai_docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ 
- PostgreSQL database
- Clerk account for authentication
- npm or yarn

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/techstore.git
cd techstore
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

4. Set up the database:
```bash
# Generate database migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Seed the database (optional)
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Apply migrations
npx drizzle-kit studio    # Open Drizzle Studio GUI
npm run seed              # Seed database with sample data
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **products** - Product catalog with pricing and inventory
- **categories** - Product categories and organization
- **customers** - User profiles linked to Clerk auth
- **orders** - Order processing and tracking
- **orderItems** - Individual items within orders
- **carts** - Shopping cart persistence
- **cartItems** - Items in shopping carts
- **adminUsers** - Admin users with permissions

## 🔐 Authentication

Authentication is handled by Clerk. The application includes:

- Email/password authentication
- Social login providers (Google, GitHub)
- Protected routes for admin dashboard
- User profile management
- Session management

## 🎨 Styling & Theming

- **Tailwind CSS v4** for utility-first styling
- **Dark mode** support with system preference detection
- **Custom theme** variables in `globals.css`
- **Responsive design** with mobile-first approach
- **shadcn/ui** components for consistent UI

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- Netlify

## 📄 API Routes

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/[id]` - Update cart item
- `DELETE /api/cart/items/[id]` - Remove from cart

### Orders
- `GET /api/orders` - List user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

### Admin
- `GET /api/admin/*` - Admin-only endpoints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Clerk](https://clerk.dev/) - Authentication solution
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

For support, email support@techstore.com or open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and TypeScript