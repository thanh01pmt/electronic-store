# Coding Conventions

## Language Standards
- **TypeScript**: Always use TypeScript, define clear interfaces and type definitions under `/types`.
- **React Server Components (RSC)**: Keep components server-side by default. Use `"use client"` only when incorporating browser state, effects, or hooks.
- **Server Actions**: Place server-only logic in server action files (typically under `lib/server-actions/`) labeled with `"use server"`.

## Naming Conventions
- **Files**: Use kebab-case for filenames (`cart-actions.ts`, `stripe-checkout`), PascalCase for React component files (`Container.tsx`, `Header.tsx`).
- **Interfaces / Types**: Append type suffix to name, example: `UserType`, `CartItemType`.
- **Constants**: Use UPPER_SNAKE_CASE (`MONGODB_URL`, `DB_NAME`).

## Imports
- Use alias `@/` for imports referencing `/` directory:
  - Example: `import { env } from "@/env";`
  - Example: `import { Container } from "@/components/ui/container";`
