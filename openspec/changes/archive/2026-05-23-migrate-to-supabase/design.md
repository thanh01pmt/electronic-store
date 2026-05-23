# Design: Migrate to Supabase

## Goals
1. Replace Clerk Auth with Supabase Auth using PKCE flow and Next.js SSR middleware.
2. Migrating unstructured BSON collections in MongoDB to relational PostgreSQL tables.
3. Replace AWS S3 API with Supabase Storage Client (`storage.from('pcb-gerbers')`).
4. Re-implement parts cache database table (`parts_cache`) to replace Upstash Redis dependency for rate limit/caching.

## Relational Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    s3_file_dir VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Carts (User Carts and Guest Carts)
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cart_id VARCHAR(50), -- Used for guest carts tracking
    cart_size INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cart Items
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Part' or 'PCB'
    ordered_qty INT NOT NULL,
    details JSONB NOT NULL, -- Stores all product configurations/properties
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders
CREATE TABLE orders (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'Placed' NOT NULL,
    cart_value NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL,
    cart_total NUMERIC(10, 2) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    shipper VARCHAR(255),
    awb VARCHAR(255),
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    cart_snapshot JSONB NOT NULL, -- Snapshots cart_items during placement
    currency VARCHAR(10) NOT NULL,
    exchange_rate NUMERIC(10, 4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Parts API Cache (replaces Upstash Redis)
CREATE TABLE parts_cache (
    part_name VARCHAR(255) PRIMARY KEY,
    parts_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Storage Bucket Configuration
- **Bucket Name**: `pcb-designs` (Public or private bucket with RLS policies).
- **Directory Layout**: `<user_id_or_cart_id>/<file_name>` matching the original AWS S3 layout logic.

## Auth Flow
- App client uses `@supabase/ssr` to retrieve session info on the server (RSC and Middleware) and `@supabase/supabase-js` on client.
- Redux and context wrappers are updated to fetch and synchronize session status on state change.
