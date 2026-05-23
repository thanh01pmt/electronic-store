# Architecture Reference

## Overview
Circuit Parts is a digital quote-to-order electronic store built with Next.js 14. It uses a serverless, event-driven architecture combining React Server Components, Server Actions, and REST API endpoints.

## Folder Structure
- `/app` — App router pages, layouts, and API routes.
- `/components` — Shared React UI components (including email templates, header, footer).
- `/context` — React context providers for local state (Auth, Redux, Currency).
- `/data` — Mock/static data configurations.
- `/lib` — Utility functions, constants, server actions, and DB/S3 client instances.
- `/pages` — Documentation pages powered by Nextra.
- `/public` — Public static assets.
- `/tests` — E2E testing using Playwright.
- `/types` — Shared TypeScript type declarations.

## Data Flow
```mermaid
graph TD
    Client[Browser Frontend] -->|Auth Token| Clerk[Clerk Auth Service]
    Client -->|Actions| ServerActions[Next.js Server Actions]
    Client -->|API Requests| RouteHandlers[Next.js Route Handlers]
    ServerActions -->|Query/Update| MongoDB[(MongoDB Atlas)]
    ServerActions -->|Upload Gerber| S3[(AWS S3 Bucket)]
    RouteHandlers -->|Checkout Session| Stripe[Stripe API]
    RouteHandlers -->|Send Email| Resend[Resend API]
```
