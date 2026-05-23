## Context

The electronic-store project needs to transition from "ELE Store" to the **VICHIP Electronics** branding, as outlined in `DESIGN.md` and visually specified in `brand-guideline.png`. The landing page currently uses simple layout features, which should be replaced by a modern hybrid layout showing key value metrics and a category explorer.

## Goals / Non-Goals

**Goals:**
- Systematically rebrand name references from "ELE Store" / "Circuit Parts" to "VICHIP Electronics" in metadata, header, footer, app constants, and components.
- Configure tailwind/CSS tokens to employ `#00A651` (VICHIP Green) and `#006B3F` (Dark Green) as primary color accents.
- Integrate Google Font "Exo 2" for headlines and "Inter" for UI text.
- Overhaul `app/page.tsx` with a premium dark/light hybrid hero banner, a 4-column value metrics section, and a 9-item product categories grid.

**Non-Goals:**
- Completely rebuilding the backend search and quote workflows (keep existing API and DB handlers).
- Adding complex multi-facet parametric filtering in this specific change (this change concentrates strictly on rebranding and homepage redesign).

## Decisions

### 1. CSS & Theme Configuration
- **Decision**: Update `app/globals.css` and `tailwind.config.ts` to map CSS variables for theme colors.
- **Details**:
  - Set `--primary` and `--accent` variables to VICHIP Green (`#00A651`, HSL: `149 100% 33%`).
  - Set text and dark background colors to Tech Black (`#1E1E1E`).
- **Alternative**: Search and replace all class occurrences (e.g. `text-blue-600` to `text-green-600`), but configuring unified CSS variables is much cleaner and prevents style drift.

### 2. Next.js Fonts Integration
- **Decision**: Load "Exo 2" and "Inter" fonts via `next/font/google` inside `app/layout.tsx`.
- **Details**:
  - Create a CSS variable mapping for Exo 2 (e.g. `--font-exo2`) and configure it in tailwind config under `fontFamily: { sans: ['var(--font-inter)'], heading: ['var(--font-exo2)'] }`.

### 3. Component Architecture for Homepage
- **Decision**: Break down `app/page.tsx` into modular components inside `components/home/`:
  - `hero.tsx`: The modern Hero component containing the glowing MCU image, title, and buttons.
  - `value-metrics.tsx`: Grid with the 4 value propositions.
  - `category-grid.tsx`: Grid containing the 9 core categories with custom line SVGs.

### 4. Branding Constants
- **Decision**: Replace `PLATFORM_NAME` in `lib/constants/app.ts` to `"VICHIP Electronics"`.

## Risks / Trade-offs

- **[Risk] Font Loading FOUC (Flash of Unstyled Content)** -> *Mitigation*: Use Next.js native font loading with custom `display: swap` property to guarantee instant fallback and smooth transition.
- **[Risk] High-resolution Hero Image Load Time** -> *Mitigation*: Optimize the glowing PCB/MCU image using `next/image` with `priority` loading attribute.
