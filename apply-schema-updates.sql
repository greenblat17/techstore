-- Check if categories table exists, if not create it
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"image" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

-- Add new columns to products table if they don't exist
DO $$ 
BEGIN
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'slug') THEN
        ALTER TABLE "products" ADD COLUMN "slug" varchar(255) NOT NULL DEFAULT '';
    END IF;
    
    -- Add short_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'short_description') THEN
        ALTER TABLE "products" ADD COLUMN "short_description" text;
    END IF;
    
    -- Add sale_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'sale_price') THEN
        ALTER TABLE "products" ADD COLUMN "sale_price" numeric(10, 2);
    END IF;
    
    -- Add category_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'category_id') THEN
        ALTER TABLE "products" ADD COLUMN "category_id" uuid;
    END IF;
    
    -- Add brand column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'brand') THEN
        ALTER TABLE "products" ADD COLUMN "brand" varchar(255);
    END IF;
    
    -- Add specifications column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'specifications') THEN
        ALTER TABLE "products" ADD COLUMN "specifications" json DEFAULT '{}'::json;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE "products" ADD COLUMN "status" varchar(50) DEFAULT 'active' NOT NULL;
    END IF;
    
    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'featured') THEN
        ALTER TABLE "products" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;
    END IF;
    
    -- Add rating_average column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'rating_average') THEN
        ALTER TABLE "products" ADD COLUMN "rating_average" numeric(2, 1) DEFAULT '0';
    END IF;
    
    -- Add rating_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'rating_count') THEN
        ALTER TABLE "products" ADD COLUMN "rating_count" integer DEFAULT 0 NOT NULL;
    END IF;
END $$;

-- Drop the old category column if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE "products" DROP COLUMN "category";
    END IF;
END $$;

-- Generate slugs for existing products that have empty slugs
UPDATE "products" 
SET "slug" = LOWER(REPLACE(REPLACE(REPLACE("name", ' ', '-'), '(', ''), ')', ''))
WHERE "slug" = '' OR "slug" IS NULL;

-- Add unique constraint to slug if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'products' AND constraint_name = 'products_slug_unique') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");
    END IF;
END $$;

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'categories' AND constraint_name = 'categories_parent_id_categories_id_fk') THEN
        ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" 
        FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'products' AND constraint_name = 'products_category_id_categories_id_fk') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" 
        FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;