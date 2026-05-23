# Tasks: Migrate to Supabase

## 1. Preparation & Setup
- [ ] 1.1 Install Supabase dependencies: `npm install @supabase/supabase-js @supabase/ssr`
- [ ] 1.2 Uninstall Clerk dependencies: `npm uninstall @clerk/nextjs @clerk/types`
- [ ] 1.3 Uninstall AWS SDK dependencies: `npm uninstall @aws-sdk/client-s3 @aws-sdk/s3-presigned-post @aws-sdk/s3-request-presigner aws-sdk`
- [ ] 1.4 Update `env.js` to include Supabase variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and remove MongoDB/AWS/Clerk variables.
- [ ] 1.5 Update `.env` and `.env.example` with Supabase key placeholders.

## 2. Supabase Client Configuration
- [ ] 2.1 Create Supabase clients: client-side client (`lib/utils/supabase-client.ts`), server-side client (`lib/utils/supabase-server.ts`), and middleware client (`lib/utils/supabase-middleware.ts`).
- [ ] 2.2 Write Supabase database helper functions and remove legacy Mongo helper files in `lib/constants/mongo.ts`.

## 3. Auth Migration
- [ ] 3.1 Refactor Next.js middleware in `middleware.ts` to refresh Supabase session and perform route-based redirects instead of Clerk auth check.
- [ ] 3.2 Update root layout in `app/layout.tsx` to replace `<ClerkProvider>` with Supabase session providers.
- [ ] 3.3 Replace user profile components and profile icons with custom login/logout forms or Supabase Auth UI helpers.

## 4. Storage Migration
- [ ] 4.1 Update PCB design Gerber files upload, relocation, and deletion functions in `lib/server-actions/s3-actions.ts` to use Supabase Storage SDK instead of AWS S3 SDK.
- [ ] 4.2 Rename `lib/server-actions/s3-actions.ts` to `lib/server-actions/storage-actions.ts` and clean up `lib/constants/aws-s3.ts`.

## 5. DB Queries & Server Actions Migration
- [ ] 5.1 Refactor cart operations in `lib/server-actions/cart-actions.ts` to fetch, merge, and update carts in the `carts` and `cart_items` relational tables.
- [ ] 5.2 Refactor checkout operations in `lib/server-actions/checkout-actions.ts` to construct relational orders.
- [ ] 5.3 Refactor helper server actions in `lib/server-actions/helper-actions.ts` (fetch user profiles, update cart).
- [ ] 5.4 Refactor BOM parts cache in `lib/server-actions/get-parts-action.ts` to store cached responses in `parts_cache` table.

## 6. Testing & Validation
- [ ] 6.1 Validate build successfully: `SKIP_ENV_VALIDATION=true npm run build`
- [ ] 6.2 Validate specifications: `openspec validate migrate-to-supabase --strict`
