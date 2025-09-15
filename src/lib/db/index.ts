import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not defined. Please check your .env.local file.'
  );
}

// Configuration for Supabase
// - prepare: false - required for Transaction pooling mode
// - ssl: 'require' - always required for Supabase connection
const isSupabase = connectionString.includes('supabase.co');
const client = postgres(connectionString, { 
  prepare: false,
  ssl: isSupabase ? 'require' : (process.env.NODE_ENV === 'production' ? 'require' : false)
});

export const db = drizzle(client, { schema });