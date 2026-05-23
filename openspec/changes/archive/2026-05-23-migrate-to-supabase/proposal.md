# Change: Migrate to Supabase

## Why
Transition the application backend from a multi-provider stack (MongoDB Atlas, Clerk Auth, AWS S3) to a unified Supabase instance. This simplifies local environment setup, reduces network round-trips by co-locating auth/db/storage, lowers operational complexity, and uses a standard PostgreSQL relational database.

## What Changes
- **BREAKING**: Replace Clerk Auth with Supabase Auth (`@supabase/ssr` / `@supabase/supabase-js`). Replace Clerk components and hooks (`<ClerkProvider>`, `<UserButton>`, `auth()`, `useAuth()`) with Supabase client equivalents.
- **BREAKING**: Replace MongoDB client and raw collection access (`usersCollection`, `guestCartsCollection`, `openOrdersCollection`) with Supabase DB Client or Drizzle ORM querying PostgreSQL tables.
- **BREAKING**: Replace AWS S3 commands (`CopyObjectCommand`, `DeleteObjectCommand`, `ListObjectsV2Command`) with Supabase Storage Client commands for PCB Gerber uploads.
- **DEPRECATED**: Remove Upstash Redis client. Re-implement parts API caching directly in PostgreSQL tables using timestamps (since PG can easily handle local caching at our scale), or keep Upstash Redis optional.
- **CONFIG**: Deprecate environment variables related to Clerk, MongoDB, Upstash, and AWS. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `env.js`, `.env`, and `.env.example`.

## Impact
- Specs: `auth`, `database`, `storage`
- Code:
  - `env.js`
  - `middleware.ts`
  - `app/layout.tsx`
  - `app/api/stripe-checkout/route.ts`
  - `lib/constants/mongo.ts`
  - `lib/constants/aws-s3.ts`
  - `lib/server-actions/helper-actions.ts`
  - `lib/server-actions/cart-actions.ts`
  - `lib/server-actions/checkout-actions.ts`
  - `lib/server-actions/order-history-actions.ts`
  - `lib/server-actions/s3-actions.ts`
