## 1. Theme & Font Configuration

- [x] 1.1 Update `app/globals.css` with CSS variables mapping VICHIP Green (`#00A651`) as primary/accent color and Tech Black (`#1E1E1E`) as dark backgrounds.
- [x] 1.2 Update `tailwind.config.ts` to support VICHIP colors and map `--font-exo2` and `--font-inter` to heading and sans font families.
- [x] 1.3 Update `app/layout.tsx` to load Google Fonts `Exo 2` and `Inter` with `subsets: ["vietnamese", "latin"]` to ensure flawless Vietnamese text rendering.

## 2. Platform Branding Rebuild

- [x] 2.1 Update `lib/constants/app.ts` changing `PLATFORM_NAME` to `"VICHIP Electronics"` and updating other brand description constants.
- [x] 2.2 Rebrand site metadata and OpenGraph configuration in `app/layout.tsx`, `app/auth/login/page.tsx`, and `app/auth/signup/page.tsx`.
- [x] 2.3 Rebrand email templates (`components/email/signup-email-template.tsx`, `components/email/order-confirmation-email-template.tsx`, `app/api/order-email/route.ts`).
- [x] 2.4 Update footer and brand header link logo in `theme.config.tsx` and navbar components.

## 3. Homepage Redesign

- [x] 3.1 Generate a premium industrial-tech glowing MCU/PCB image for the homepage hero.
- [x] 3.2 Implement `components/home/hero.tsx` using VICHIP color system, containing CTAs for RFQ and Product Lines.
- [x] 3.3 Implement `components/home/value-metrics.tsx` presenting the 4 core value proposition cards with clean line icons.
- [x] 3.4 Implement `components/home/category-grid.tsx` featuring the 9 electronic categories with customized SVGs.
- [x] 3.5 Overhaul `app/page.tsx` to mount and structure these redesigned landing page sections.

## 4. Verification & Validation

- [x] 4.1 Run local build check `npm run build` to verify there are no compilation issues.
- [x] 4.2 Validate the proposal state using `openspec validate rebrand-to-vichip-redesign-home --strict`.
