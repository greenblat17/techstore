# Database Setup Instructions

## Prerequisites

Before setting up the database, ensure you have PostgreSQL installed on your system.

### Install PostgreSQL

#### macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows:
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 1: Create Database

### Option A: Using psql command line

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE techstore;

# Create user (optional)
CREATE USER techstore_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE techstore TO techstore_user;

# Exit
\q
```

### Option B: Using pgAdmin

1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it "techstore"
5. Click "Save"

## Step 2: Configure Environment Variables

Update your `.env.local` file with your database connection string:

```env
# If using default PostgreSQL installation
DATABASE_URL=postgresql://postgres:password@localhost:5432/techstore

# If you created a specific user
DATABASE_URL=postgresql://techstore_user:your_secure_password@localhost:5432/techstore

# For external databases (Supabase, Neon, etc.)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

## Step 3: Run Database Migrations

Generate and apply the database schema:

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:push

# Or use migrate for production
npm run db:migrate
```

## Step 4: Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- 12 sample products
- 1 test customer (update Clerk ID after creating user in Clerk)
- 1 test admin (update Clerk ID after creating admin in Clerk)

## Step 5: Verify Database Setup

### Using Drizzle Studio (GUI)

```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio` where you can:
- View all tables
- Browse data
- Run queries
- Manage records

### Using psql

```bash
psql -U postgres -d techstore

# List all tables
\dt

# View products table structure
\d products

# Query products
SELECT * FROM products LIMIT 5;
```

## Available Database Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Push schema to database (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Open Drizzle Studio GUI
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## Troubleshooting

### Connection Refused Error

If you get "connection refused" error:

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Services app
   ```

2. Verify PostgreSQL is listening on the correct port:
   ```bash
   psql -U postgres -c "SHOW port;"
   ```

### Authentication Failed

If you get authentication errors:

1. Check your password in `.env.local`
2. Verify user exists:
   ```bash
   psql -U postgres -c "\du"
   ```

3. Check pg_hba.conf settings (usually in `/etc/postgresql/15/main/` on Linux)

### Database Does Not Exist

Create it manually:
```bash
psql -U postgres -c "CREATE DATABASE techstore;"
```

## Database Schema Overview

The database includes the following tables:

- **products** - Product catalog with inventory
- **customers** - Customer profiles (synced with Clerk)
- **orders** - Order management
- **orderItems** - Order line items
- **carts** - Shopping cart persistence
- **cartItems** - Cart line items
- **adminUsers** - Admin user management

All tables use UUID primary keys and include proper relations and indexes for optimal performance.

## Next Steps

After setting up the database:

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Get your API keys from Clerk dashboard
3. Update `.env.local` with Clerk keys
4. Create test users in Clerk
5. Update seed.ts with actual Clerk user IDs
6. Run the development server: `npm run dev`

## Using with Cloud Databases

### Supabase
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Neon
```env
DATABASE_URL=postgresql://[user]:[password]@[endpoint-id].neon.tech/[database]?sslmode=require
```

### Railway
```env
DATABASE_URL=postgresql://postgres:[password]@[host].railway.app:[port]/railway
```

Remember to run migrations after connecting to your cloud database!