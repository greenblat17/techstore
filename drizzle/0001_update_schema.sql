-- Create categories table
CREATE TABLE "categories" (
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
--> statement-breakpoint

-- Add new columns to products table
ALTER TABLE "products" ADD COLUMN "slug" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "products" ADD COLUMN "short_description" text;
ALTER TABLE "products" ADD COLUMN "sale_price" numeric(10, 2);
ALTER TABLE "products" ADD COLUMN "category_id" uuid;
ALTER TABLE "products" ADD COLUMN "brand" varchar(255);
ALTER TABLE "products" ADD COLUMN "specifications" json DEFAULT '{}'::json;
ALTER TABLE "products" ADD COLUMN "status" varchar(50) DEFAULT 'active' NOT NULL;
ALTER TABLE "products" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;
ALTER TABLE "products" ADD COLUMN "rating_average" numeric(2, 1) DEFAULT '0';
ALTER TABLE "products" ADD COLUMN "rating_count" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint

-- Drop the old category column since we now use category_id
ALTER TABLE "products" DROP COLUMN "category";
--> statement-breakpoint

-- Add unique constraint to slug
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");
--> statement-breakpoint

-- Add foreign key constraints
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;