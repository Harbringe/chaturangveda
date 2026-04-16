# Design Spec: Hero Improvements & Admin Panel Completeness
**Date:** 2026-04-17
**Status:** Approved

---

## Overview

Six changes to the Chaturangveda homepage and admin panel. All changes must respect the existing brand: deep navy/dark surfaces, `#b8c3ff` primary blue, `#e9c349` gold for excellence/achievements, Manrope/Work Sans fonts, rounded-lg corners, no 1px divider lines.

---

## 1. Hero Section Height Overflow Fix

**Problem:** On viewports short in height (e.g. 700px or less), the hero's bottom content (stats, CTA buttons) is clipped behind the `AnimatedTextBanner` (marquee) below it because `overflow: hidden` cuts off content while `height: 100vh` doesn't shrink.

**Fix:**
In `HeroSection.module.css`:
- Change `overflow: hidden` → `overflow: clip` (clips visuals without affecting scroll)
- Add `@media (max-height: 720px)` rule reducing `.heroLayout` top padding from `clamp(100px,13vh,150px)` to `80px` and gap from default to `24px`
- Add `@media (max-height: 600px)` hiding `.heroVisual` (right panel) and collapsing to single column to prevent any clipping

---

## 2. Home Link in Desktop Navbar

**Problem:** Desktop navbar has Services, Coaches, Curriculum, Blog, Contact, Become a Coach — but no Home link. Mobile menu already has one.

**Fix:** In `Navbar.tsx`, insert `{ label: 'Home', href: '/' }` as the first item in the desktop `links` array, rendered before the Services dropdown, with `navLinkActive` applied when `pathname === '/'`.

---

## 3. Key Achievement — Editorial Feature Card (Option C)

### Admin side
- Add `isKey: boolean` field to the Achievement schema in `/admin/achievements/page.tsx`
- Add a "★ Set as Key Achievement" toggle button per achievement item in the list (radio-style: setting one clears all others)
- The toggle is visually distinct: gold background when active

### Data/API side
- `isKey` is stored in the achievements JSON via the existing `/api/admin/content/achievements` endpoint (no schema migration needed — it's JSON)
- `page.tsx` (home): when mapping achievements, extract the one with `isKey === true` as `keyAchievement`, pass separately to `HeroSection`
- If none is marked `isKey`, fall back to first achievement

### HeroSection frontend
- New prop: `keyAchievement?: Achievement` (same shape as existing Achievement interface)
- The right panel layout changes:
  1. **Top:** Editorial feature card (see styling below)
  2. **Bottom:** Compact panel titled "More Achievements" with remaining achievements (excluding the key one)
- The current hardcoded toast card at top-right is **removed** and replaced by this feature card
- The existing `coachPanel` (student achievements list) becomes "More Achievements" below

### Editorial card styling (brand-faithful)
```
Background: linear-gradient(160deg, rgba(21,101,192,0.12) 0%, var(--surface) 50%, rgba(233,195,73,0.04) 100%)
Border: 1.5px solid rgba(233,195,73,0.25)
Border-radius: var(--radius-lg) = 14px
Gold "⭐ Key Achievement" eyebrow badge (same gold as tertiary: #e9c349)
Student name: headline-sm, --text color, font-weight 800
Achievement: --primary color (#b8c3ff)
Detail: --muted
Photo: 56px circle, 2px gold ring border
Bottom strip: 3 mini stats (training duration / event level / year) + "Read Story →" ghost button
Subtle radial glow: rgba(233,195,73,0.06) at top-right
```

---

## 4. Book Free Trial — Redirect to Internal Booking Page

**Problem:** The navbar "Book Free Trial" button links directly to `https://chaturangveda.wise.live/book/consultation` (external). The user wants the button to first go to `/book-free-trial` (internal page), which already has both "Open Booking Calendar" and "Message on WhatsApp" options.

**Fix:**
In `Navbar.tsx`:
- Change the "Book Free Trial" `<a>` to `<Link href="/book-free-trial">` (remove `target="_blank"`)
- The `BOOK_URL` constant stays for internal use by the booking page itself — only the navbar CTA changes

The hero section's "Book Free Trial →" already correctly links to `/book-free-trial` — no change needed there.

---

## 5. Become-a-Coach — Name Field Width

**Problem:** The name input in the become-a-coach form is too narrow for long names because it shares a 50/50 `fieldRow` grid with the phone field.

**Fix:** In `become-a-coach/page.module.css`:
- Change the first `fieldRow` (name + phone) grid so name takes `minmax(0, 1.6fr)` and phone takes `minmax(0, 1fr)`
- On mobile (≤640px) they already stack full-width so no change needed there

---

## 6. Admin Panel — Hardcoded Values

**Problem:** Several homepage elements are hardcoded in components and not editable from admin:
- Hero rotating phrases (`rotatingPhrases` array in `HeroSection.tsx`)
- Hero mini-stats (2000+, 10+, 10, 150+) — separate from the Stats admin which drives `StatsSection`
- Hero description paragraph text

The existing Stats admin (`/admin/stats`) drives `StatsSection`, not the hero. Rather than merging them, add a new "**Hero Settings**" admin page.

### New page: `/admin/hero` — "Hero Settings"

**Fields:**
1. **Headline Line 1** (default: "Master Chess.")
2. **Headline Line 2 / Highlight** (default: "Master Life.")
3. **Description paragraph** (default: current hardcoded text)
4. **Rotating phrases** — editable list (add/remove/reorder), seeded with current 6 phrases
5. **Mini stats** — editable list of `{ value, label }`, seeded with current 4 stats

**Storage:** `/api/admin/content/hero-settings` (same pattern as other content endpoints)

**HeroSection changes:**
- Accept optional `heroSettings` prop (headline, description, phrases, stats)
- Fall back to current hardcoded values when prop is absent (zero regression)
- `page.tsx` fetches hero-settings alongside achievements and testimonials

**Admin sidebar:** Add `{ href: '/admin/hero', label: 'Hero Settings', icon: '🏠' }` at the top of the NAV list.

---

## Scope Boundaries (YAGNI)

- No changes to StatsSection, FeaturesSection, CoursesSection, BenefitsSection, or CTASection
- No new DB tables — all content stored as JSON via existing `content` API pattern
- Rotating phrases remain client-side animated (no server changes to animation logic)
- The `design-preview.html` file in `/public` should be deleted before shipping

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/HeroSection.module.css` | Height overflow fix + editorial card styles |
| `src/components/HeroSection.tsx` | Key achievement prop, editorial card, hero settings prop |
| `src/components/Navbar.tsx` | Home link + Book Free Trial → internal route |
| `src/app/page.tsx` | Fetch hero-settings + keyAchievement, pass to HeroSection |
| `src/app/admin/(cms)/achievements/page.tsx` | isKey toggle |
| `src/app/admin/(cms)/hero/page.tsx` | New page |
| `src/app/admin/AdminSidebar.tsx` | Hero Settings nav item |
| `src/app/become-a-coach/page.module.css` | Name field width |
| `public/design-preview.html` | Delete |
