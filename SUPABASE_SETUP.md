# Supabase Setup Guide

## 🚀 Quick Start

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account (GitHub login recommended)
3. Create a new project:
   - **Project Name**: techstore
   - **Database Password**: Save this securely! You'll need it.
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

### Step 2: Get Database Credentials

1. Go to your project dashboard
2. Click on **Settings** (gear icon) in the sidebar
3. Navigate to **Database** section
4. Find your connection string under **Connection string** → **URI**

It will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Step 3: Configure Environment Variables

Update your `.env.local` file:

```env
# Supabase Database URL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Optional: Add pooling for better performance in production
# DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true

# Supabase API Keys (for future features like auth, storage)
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these values:**
- **DATABASE_URL**: Settings → Database → Connection string
- **SUPABASE_URL**: Settings → API → Project URL
- **SUPABASE_ANON_KEY**: Settings → API → Project API keys → anon/public
- **SUPABASE_SERVICE_ROLE_KEY**: Settings → API → Project API keys → service_role

### Step 4: Update Drizzle Configuration

Your `drizzle.config.ts` is already configured correctly:

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Step 5: Update Database Connection

The connection in `src/lib/db/index.ts` needs a small update for Supabase:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// For Supabase, we need to disable prefetch
const client = postgres(connectionString, { 
  prepare: false,
  ssl: 'require' // Required for Supabase
});

export const db = drizzle(client, { schema });
```

### Step 6: Run Migrations

```bash
# Generate migration files
npm run db:generate

# Push schema to Supabase
npm run db:push

# Verify in Supabase Dashboard
# Go to Table Editor in your Supabase project to see the tables
```

### Step 7: Seed Database (Optional)

```bash
npm run db:seed
```

### Step 8: Test Connection

```bash
# Open Drizzle Studio to verify connection
npm run db:studio

# Or test with a simple query
npx tsx -e "import { db } from './src/lib/db/index.js'; import { products } from './src/lib/db/schema.js'; db.select().from(products).limit(1).then(console.log)"
```

## 🎯 Supabase Features You Can Use

### 1. Row Level Security (RLS)
Supabase provides built-in row-level security. You can enable it in the Supabase dashboard:
- Go to Authentication → Policies
- Create policies for each table
- Example: "Users can only see their own orders"

### 2. Realtime Subscriptions
```typescript
// Future feature: Real-time updates
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Subscribe to changes
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, 
    payload => console.log('New order!', payload)
  )
  .subscribe();
```

### 3. Storage (for product images)
```typescript
// Upload product images
const { data, error } = await supabase.storage
  .from('products')
  .upload('product-1.jpg', file);
```

### 4. Edge Functions (serverless)
Create API endpoints that run on Supabase Edge Runtime.

## 🔧 Troubleshooting

### Connection Issues

1. **SSL Error**: Make sure you have `ssl: 'require'` in your postgres connection
2. **Password Issues**: Check if password contains special characters - URL encode them
3. **Timeout**: Supabase free tier pauses after 1 week of inactivity - just wake it up in dashboard

### Migration Issues

1. **Permission denied**: Make sure you're using the correct password
2. **Table already exists**: Drop tables in Supabase dashboard or use `db:push` with `--force`

### Performance Tips

1. **Use Connection Pooling** for production:
   ```env
   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:6543/postgres?pgbouncer=true
   ```

2. **Enable pgBouncer** in Supabase dashboard:
   - Settings → Database → Connection Pooling → Enable

3. **Use Indexes**: Supabase automatically creates some indexes, but add more as needed:
   ```sql
   CREATE INDEX idx_products_category ON products(category);
   CREATE INDEX idx_orders_customer_id ON orders(customer_id);
   ```

## 📊 Monitoring

### Supabase Dashboard Features

1. **Table Editor**: Visual interface for data management
2. **SQL Editor**: Run custom queries
3. **Logs**: Monitor database activity
4. **Reports**: Usage statistics and performance metrics

### Useful SQL Queries for Supabase

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Slow queries
SELECT 
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🚢 Production Checklist

- [ ] Enable Row Level Security on all tables
- [ ] Set up proper indexes for frequently queried columns
- [ ] Enable connection pooling
- [ ] Configure backup strategy (Supabase does daily backups on Pro plan)
- [ ] Set up monitoring alerts
- [ ] Review and optimize slow queries
- [ ] Enable query performance insights

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Drizzle with Supabase](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Next Steps

1. ✅ Database is ready for development
2. Continue building the application features
3. Consider adding Supabase Auth instead of Clerk (optional)
4. Set up image storage for products
5. Implement real-time features for admin dashboard