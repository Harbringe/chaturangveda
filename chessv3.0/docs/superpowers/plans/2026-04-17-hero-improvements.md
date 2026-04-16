# Hero Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix hero height overflow, add Home nav link, implement key-achievement editorial card (Option C), route Book Free Trial through internal page, widen coach name field, and add Hero Settings admin page.

**Architecture:** All content is stored in a PostgreSQL `site_content` table via `getContent`/`setContent` (see `src/lib/content.ts`). Admin pages POST to `/api/admin/content/[key]` (already handles any key — no new routes needed). HeroSection accepts new optional props and falls back to hardcoded values when absent.

**Tech Stack:** Next.js 15 App Router, TypeScript, CSS Modules, Framer Motion, PostgreSQL via `src/lib/content.ts`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/HeroSection.module.css` | Modify | Height overflow fix + editorial card styles |
| `src/components/HeroSection.tsx` | Modify | Accept heroSettings + keyAchievement props; render editorial card; remove toast |
| `src/components/Navbar.tsx` | Modify | Add Home link to desktop nav; change Book Free Trial to internal `/book-free-trial` |
| `src/app/page.tsx` | Modify | Fetch `hero-settings` from DB; pass heroSettings + keyAchievement to HeroSection |
| `src/app/admin/(cms)/achievements/page.tsx` | Modify | Add `isKey` field + "Set as Key" toggle (radio-style) |
| `src/app/admin/(cms)/hero/page.tsx` | Create | Hero Settings admin page (headline, description, phrases, stats) |
| `src/app/admin/AdminSidebar.tsx` | Modify | Add Hero Settings nav item |
| `src/app/become-a-coach/page.module.css` | Modify | Widen name field (60/40 split) |
| `public/design-preview.html` | Delete | Remove preview file |

---

## Task 1: Fix Hero Height Overflow

**Files:**
- Modify: `src/components/HeroSection.module.css`

**Problem:** On short viewports (height ≤ 720px) the `.hero` element uses `height: 100vh; overflow: hidden` which clips the CTA buttons and stats behind the `AnimatedTextBanner` below.

- [ ] Open `src/components/HeroSection.module.css`. Find the `.hero` rule (line 1–10) and change `overflow: hidden` to `overflow: clip`:

```css
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 960px;
  min-height: 700px;
  display: flex;
  align-items: flex-start;
  overflow: clip;
  background: var(--surface);
}
```

- [ ] Find the existing `@media (max-width: 768px)` block. Immediately **before** it, add two new media queries that reduce padding on short viewports:

```css
/* Short viewport: reduce top padding so CTA buttons are never clipped */
@media (max-height: 720px) {
  .heroLayout {
    padding-top: 80px;
    gap: 32px;
  }
}

@media (max-height: 600px) {
  .heroLayout {
    padding-top: 72px;
    gap: 20px;
  }
  .heroVisual {
    display: none;
  }
}
```

- [ ] Commit:
```bash
cd /e/chaturangaveda/chessv3.0
git add src/components/HeroSection.module.css
git commit -m "fix: prevent hero content clipping on short viewports"
```

---

## Task 2: Add Home Link + Fix Book Free Trial in Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] Open `src/components/Navbar.tsx`. At the top, verify `Link` is already imported from `'next/link'` (it is — used for logo and mobile menu).

- [ ] Find the `links` array (around line 31). Add `Home` as the first entry:

```ts
const links = [
  { label: 'Home', href: '/' },
  { label: 'Coaches', href: '/coaches' },
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];
```

- [ ] Find the desktop "Book Free Trial" button (around line 102). It is currently an `<a>` pointing to `BOOK_URL` (external). Replace it with a `<Link>` pointing to the internal booking page:

```tsx
<li>
  <Link href="/book-free-trial" className={`btn-primary ${styles.navCTA}`}>
    Book Free Trial
  </Link>
</li>
```

- [ ] The mobile menu already has a Home link and its Book Free Trial also points to `BOOK_URL`. Find the mobile menu Book Free Trial (around line 136) and update it:

```tsx
<Link href="/book-free-trial" className={styles.mobileCTA} onClick={() => setMobileOpen(false)}>
  Book Free Trial
</Link>
```

- [ ] Commit:
```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Home link to desktop nav; route Book Free Trial to internal page"
```

---

## Task 3: Widen Name Field in Become-a-Coach

**Files:**
- Modify: `src/app/become-a-coach/page.module.css`

- [ ] Open `src/app/become-a-coach/page.module.css`. Find `.fieldRow` (around line 272):

```css
.fieldRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
```

Add a `.fieldRowNamePhone` variant that gives the name field more width. Add this immediately after `.fieldRow`:

```css
.fieldRowNamePhone {
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 20px;
}
```

- [ ] Open `src/app/become-a-coach/page.tsx`. Find the first `fieldRow` div (the one containing the name + phone fields, around line 190):

```tsx
<div className={styles.fieldRow}>
```

Change it to use the new class:

```tsx
<div className={styles.fieldRowNamePhone}>
```

- [ ] Find the existing mobile breakpoint in `page.module.css` that stacks fieldRow to 1 column (around line 590). Ensure it also covers the new class:

```css
@media (max-width: 640px) {
  .fieldRow,
  .fieldRowNamePhone { grid-template-columns: 1fr; }
}
```

- [ ] Commit:
```bash
git add src/app/become-a-coach/page.module.css src/app/become-a-coach/page.tsx
git commit -m "fix: widen name input field in become-a-coach form"
```

---

## Task 4: Add isKey Toggle to Achievements Admin

**Files:**
- Modify: `src/app/admin/(cms)/achievements/page.tsx`

- [ ] Open `src/app/admin/(cms)/achievements/page.tsx`. Find the `Achievement` interface and add `isKey`:

```ts
interface Achievement {
  id: string;
  name: string;
  achievement: string;
  event: string;
  year: string;
  photo: string;
  photoFocus: FocusPosition;
  badge: 'gold' | 'silver' | 'bronze' | '';
  isKey?: boolean;
}
```

- [ ] Find the `EMPTY` constant and add `isKey: false`:

```ts
const EMPTY: Omit<Achievement, 'id'> = {
  name: '', achievement: '', event: '', year: '',
  photo: '', photoFocus: 'center center', badge: '',
  isKey: false,
};
```

- [ ] Add a `setKeyAchievement` helper function inside the component (after the existing `deleteItem` function):

```ts
function setKeyAchievement(id: string) {
  const updated = items.map((a) => ({ ...a, isKey: a.id === id }));
  setItems(updated);
  save(updated);
}
```

- [ ] In the `SortableList` `renderItem` callback, add a "★ Key" toggle button next to each item. Find the `renderItem` prop (around line 160):

```tsx
renderItem={(item) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>{item.name}</div>
      <div style={{ fontSize: '0.75rem', color: '#718096' }}>
        {item.achievement}{item.event ? ` · ${item.event}` : ''}{item.year ? ` (${item.year})` : ''}
      </div>
    </div>
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setKeyAchievement(item.id); }}
      style={{
        marginLeft: 'auto',
        padding: '3px 10px',
        borderRadius: 6,
        border: '1.5px solid',
        cursor: 'pointer',
        fontSize: '0.72rem',
        fontWeight: 700,
        background: item.isKey ? '#e9c349' : '#fff',
        borderColor: item.isKey ? '#e9c349' : '#e2e8f0',
        color: item.isKey ? '#241a00' : '#718096',
        whiteSpace: 'nowrap',
      }}
    >
      {item.isKey ? '★ Key Achievement' : '☆ Set as Key'}
    </button>
  </div>
)}
```

- [ ] Commit:
```bash
git add src/app/admin/(cms)/achievements/page.tsx
git commit -m "feat: add isKey toggle to achievements admin"
```

---

## Task 5: Add Editorial Card CSS to HeroSection

**Files:**
- Modify: `src/components/HeroSection.module.css`

- [ ] Open `src/components/HeroSection.module.css`. Find the `/* Coach panel */` comment (around line 387) and add the editorial card styles **before** it:

```css
/* ── Key Achievement Editorial Card ───────────────────────── */
.editorialCard {
  background: linear-gradient(
    160deg,
    rgba(21, 101, 192, 0.10) 0%,
    var(--surface-container-lowest) 50%,
    rgba(233, 195, 73, 0.05) 100%
  );
  border: 1.5px solid rgba(233, 195, 73, 0.28);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(233, 195, 73, 0.08) inset;
}

.editorialCard::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 130px;
  height: 130px;
  background: radial-gradient(circle, rgba(233, 195, 73, 0.10), transparent 70%);
  pointer-events: none;
}

.editorialTop {
  padding: 16px 18px 12px;
  position: relative;
  z-index: 1;
}

.editorialEyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(233, 195, 73, 0.12);
  border: 1px solid rgba(233, 195, 73, 0.28);
  border-radius: 9999px;
  padding: 4px 12px;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #e9c349;
  margin-bottom: 12px;
}

.editorialInner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editorialPhoto {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(233, 195, 73, 0.45);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background: var(--surface-container);
  box-shadow: 0 0 16px rgba(233, 195, 73, 0.18);
}

.editorialPhotoPlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  background: var(--surface-container);
}

.editorialInfo {}

.editorialName {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--on-surface);
  letter-spacing: -0.025em;
  line-height: 1;
}

.editorialAch {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--primary-container);
  font-weight: 600;
  margin-top: 4px;
}

.editorialDetail {
  font-family: var(--font-body);
  font-size: 0.65rem;
  color: var(--on-surface-variant);
  margin-top: 2px;
}

.editorialBottom {
  padding: 10px 18px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.editorialMiniStats {
  display: flex;
  gap: 16px;
}

.editorialMiniStat {
  text-align: left;
}

.editorialMiniStatVal {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--on-surface);
  font-family: var(--font-heading);
}

.editorialMiniStatLbl {
  font-size: 0.58rem;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: var(--font-body);
}

.editorialReadBtn {
  background: transparent;
  border: 1px solid rgba(233, 195, 73, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #e9c349;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  font-family: var(--font-body);
}

.editorialReadBtn:hover {
  background: rgba(233, 195, 73, 0.1);
  border-color: rgba(233, 195, 73, 0.5);
}
```

- [ ] Commit:
```bash
git add src/components/HeroSection.module.css
git commit -m "feat: add editorial card CSS for key achievement"
```

---

## Task 6: Update HeroSection Component

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] Open `src/components/HeroSection.tsx`. Add the `HeroSettings` interface and update the component props. Replace the existing `Achievement` interface and component signature (around line 68–76):

```tsx
interface Achievement {
  name: string;
  achievement: string;
  detail: string;
  image: string;
  badge: string;
}

interface HeroSettings {
  headline1?: string;
  headline2?: string;
  description?: string;
  phrases?: string[];
  stats?: Array<{ value: string; label: string }>;
}

export default function HeroSection({
  achievements,
  keyAchievement,
  heroSettings,
}: {
  achievements?: Achievement[];
  keyAchievement?: Achievement;
  heroSettings?: HeroSettings;
}) {
```

- [ ] Inside the component body, replace the hardcoded `rotatingPhrases` and `stats` references with settings-aware values. Add these lines right after the existing `const studentAchievements = ...` line:

```tsx
const studentAchievements = achievements ?? FALLBACK_ACHIEVEMENTS;
const featuredAchievement = keyAchievement ?? studentAchievements[0];
const otherAchievements = studentAchievements.filter(
  (a) => a.name !== featuredAchievement.name
);
const activePhrasess = heroSettings?.phrases ?? rotatingPhrases;
const activeStats   = heroSettings?.stats   ?? stats;
const headline1     = heroSettings?.headline1 ?? 'Master Chess.';
const headline2     = heroSettings?.headline2 ?? 'Master Life.';
const description   = heroSettings?.description ??
  "Expert chess coaching for kids by FIDE-rated coaches. From your child\u2019s first move to tournament glory \u2014 online classes for students across India, USA, UK, Australia, UAE, Netherlands and beyond.";
```

- [ ] Update the `setPhraseIndex` interval to use `activePhrasess`:

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setPhraseIndex((prev) => (prev + 1) % activePhrasess.length);
  }, 2500);
  return () => clearInterval(interval);
}, [activePhrasess.length]);
```

- [ ] In the JSX, update the headline to use `headline1`/`headline2`. Find the `<motion.h1>` (around line 172):

```tsx
<motion.h1
  className={styles.heroTitle}
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  {headline1}
  <br />
  <span className={styles.highlight}>{headline2}</span>
</motion.h1>
```

- [ ] Update the rotating phrase to use `activePhrasess`:

```tsx
<motion.span
  key={phraseIndex}
  className={styles.rotatingWord}
  initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
  exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  {activePhrasess[phraseIndex]}
</motion.span>
```

- [ ] Update the description paragraph to use `description`:

```tsx
<motion.p
  className={styles.heroDescription}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7, duration: 0.7 }}
>
  {description}
</motion.p>
```

- [ ] Update the hero stats to use `activeStats`. Find the `{stats.map(...)}` inside `.heroStats` (around line 244):

```tsx
{activeStats.map((stat, i) => (
  <div key={i} className={styles.heroStat}>
    <span className={styles.heroStatValue}>{stat.value}</span>
    <span className={styles.heroStatLabel}>{stat.label}</span>
  </div>
))}
```

- [ ] **Remove the entire `toastCard` block** (the `<motion.div className={styles.toastCard}>` block, around lines 260–285). Delete it completely.

- [ ] **Replace the `coachPanel` block** with the editorial card + condensed list. Find `{/* Student Achievements panel */}` and replace everything from there to the closing `</motion.div>` of `heroVisual` (before the `{/* Stats strip */}` comment) with:

```tsx
{/* Editorial Key Achievement Card */}
<div className={styles.editorialCard}>
  <div className={styles.editorialTop}>
    <div className={styles.editorialEyebrow}>⭐ Key Achievement</div>
    <div className={styles.editorialInner}>
      <div className={styles.editorialPhoto}>
        {featuredAchievement.image ? (
          <Image
            src={featuredAchievement.image}
            alt={featuredAchievement.name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            sizes="56px"
          />
        ) : (
          <div className={styles.editorialPhotoPlaceholder}>♟</div>
        )}
      </div>
      <div className={styles.editorialInfo}>
        <div className={styles.editorialName}>{featuredAchievement.name}</div>
        <div className={styles.editorialAch}>{featuredAchievement.badge} {featuredAchievement.achievement}</div>
        <div className={styles.editorialDetail}>{featuredAchievement.detail}</div>
      </div>
    </div>
  </div>
  <div className={styles.editorialBottom}>
    <div className={styles.editorialMiniStats}>
      <div className={styles.editorialMiniStat}>
        <span className={styles.editorialMiniStatVal}>150+</span>
        <span className={styles.editorialMiniStatLbl}>Total Wins</span>
      </div>
      <div className={styles.editorialMiniStat}>
        <span className={styles.editorialMiniStatVal}>9+</span>
        <span className={styles.editorialMiniStatLbl}>Countries</span>
      </div>
    </div>
    <Link href="/blogs" className={styles.editorialReadBtn}>
      Read Stories →
    </Link>
  </div>
</div>

{/* More Achievements panel */}
<div className={styles.coachPanel}>
  <div className={styles.coachPanelHeader}>
    <span className={styles.coachPanelTitle}>More Achievements</span>
    <Link href="/blogs" className={styles.coachPanelLink}>
      View all →
    </Link>
  </div>

  {otherAchievements.map((s, i) => (
    <motion.div
      key={s.name}
      className={styles.coachRow}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
    >
      <div className={styles.coachAvatar}>
        <Image
          src={s.image}
          alt={s.name}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="40px"
        />
      </div>
      <div className={styles.coachRowInfo}>
        <div className={styles.coachRowName}>{s.name}</div>
        <div className={styles.coachRowRole}>{s.achievement}</div>
        <div className={styles.coachRowTags}>
          <span className={styles.coachRowTag}>{s.badge}</span>
          <span className={styles.coachRowTag}>{s.detail}</span>
        </div>
      </div>
    </motion.div>
  ))}
</div>
```

- [ ] Verify the file compiles by running:
```bash
cd /e/chaturangaveda/chessv3.0
npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors (or only pre-existing errors unrelated to these files).

- [ ] Commit:
```bash
git add src/components/HeroSection.tsx
git commit -m "feat: editorial key achievement card in hero; heroSettings prop"
```

---

## Task 7: Update Home Page to Fetch New Data

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Open `src/app/page.tsx`. Find the `export default async function Home()` block. Update the data fetching to also load `hero-settings`:

```tsx
const DEFAULT_PHRASES = [
  "Strategic Thinking", "Grandmaster Curriculum", "FIDE-Rated Coaches",
  "Tournament Champions", "Critical Thinkers", "Future Leaders",
];

const DEFAULT_HERO_STATS = [
  { value: "2000+", label: "Students Trained" },
  { value: "10+",   label: "Years Experience" },
  { value: "10",    label: "FIDE-Rated Coaches" },
  { value: "150+",  label: "Tournament Wins" },
];

export default async function Home() {
  const [achievements, testimonials, heroSettingsRaw] = await Promise.all([
    getContent<Array<{ name: string; achievement: string; event?: string; year?: string; photo?: string; badge?: string; isKey?: boolean }>>('achievements', []),
    getContent<Array<{ parentName: string; childName?: string; quote: string; rating: number }>>('testimonials', []),
    getContent<{
      headline1?: string;
      headline2?: string;
      description?: string;
      phrases?: string[];
      stats?: Array<{ value: string; label: string }>;
    } | null>('hero-settings', null),
  ]);
```

- [ ] After the data fetching, add the mapping for keyAchievement and heroSettings:

```tsx
  const mappedAchievements = achievements.length > 0
    ? achievements.map((a) => ({
        name: a.name,
        achievement: a.achievement,
        detail: [a.event, a.year].filter(Boolean).join(' · ') || a.achievement,
        image: a.photo ?? '',
        badge: a.badge ?? '',
      }))
    : undefined;

  const keyAch = achievements.find((a) => a.isKey);
  const mappedKeyAchievement = keyAch
    ? {
        name: keyAch.name,
        achievement: keyAch.achievement,
        detail: [keyAch.event, keyAch.year].filter(Boolean).join(' · ') || keyAch.achievement,
        image: keyAch.photo ?? '',
        badge: keyAch.badge ?? '',
      }
    : undefined;

  const heroSettings = heroSettingsRaw
    ? {
        headline1:   heroSettingsRaw.headline1,
        headline2:   heroSettingsRaw.headline2,
        description: heroSettingsRaw.description,
        phrases:     heroSettingsRaw.phrases?.length ? heroSettingsRaw.phrases : DEFAULT_PHRASES,
        stats:       heroSettingsRaw.stats?.length   ? heroSettingsRaw.stats   : DEFAULT_HERO_STATS,
      }
    : undefined;

  const mappedTestimonials = testimonials.length > 0
    ? testimonials.map((t) => ({
        text:     t.quote,
        name:     t.parentName,
        detail:   t.childName ? `Parent of ${t.childName}` : 'Chess Parent',
        initials: t.parentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        stars:    t.rating,
      }))
    : undefined;
```

- [ ] Update the `<HeroSection>` JSX call to pass the new props:

```tsx
<HeroSection
  achievements={mappedAchievements}
  keyAchievement={mappedKeyAchievement}
  heroSettings={heroSettings}
/>
```

- [ ] Verify the file compiles:
```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] Commit:
```bash
git add src/app/page.tsx
git commit -m "feat: pass keyAchievement and heroSettings to HeroSection"
```

---

## Task 8: Create Hero Settings Admin Page

**Files:**
- Create: `src/app/admin/(cms)/hero/page.tsx`

- [ ] Create the file `src/app/admin/(cms)/hero/page.tsx` with this content:

```tsx
'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';

interface HeroStat { id: string; value: string; label: string; }

interface HeroSettings {
  headline1: string;
  headline2: string;
  description: string;
  phrases: string[];
  stats: HeroStat[];
}

const DEFAULTS: HeroSettings = {
  headline1: 'Master Chess.',
  headline2: 'Master Life.',
  description:
    "Expert chess coaching for kids by FIDE-rated coaches. From your child's first move to tournament glory — online classes for students across India, USA, UK, Australia, UAE, Netherlands and beyond.",
  phrases: [
    'Strategic Thinking',
    'Grandmaster Curriculum',
    'FIDE-Rated Coaches',
    'Tournament Champions',
    'Critical Thinkers',
    'Future Leaders',
  ],
  stats: [
    { id: '1', value: '2000+', label: 'Students Trained' },
    { id: '2', value: '10+',   label: 'Years Experience' },
    { id: '3', value: '10',    label: 'FIDE-Rated Coaches' },
    { id: '4', value: '150+',  label: 'Tournament Wins' },
  ],
};

export default function HeroSettingsAdminPage() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/hero-settings')
      .then((r) => r.json())
      .then((d) => { if (d.value) setSettings({ ...DEFAULTS, ...d.value }); });
  }, []);

  async function save() {
    setSaving(true);
    await fetch('/api/admin/content/hero-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: settings }),
    });
    setSaving(false);
    setStatus('Saved');
    setTimeout(() => setStatus(''), 2500);
  }

  function addPhrase() {
    setSettings((p) => ({ ...p, phrases: [...p.phrases, ''] }));
  }

  function updatePhrase(i: number, val: string) {
    setSettings((p) => {
      const phrases = [...p.phrases];
      phrases[i] = val;
      return { ...p, phrases };
    });
  }

  function removePhrase(i: number) {
    setSettings((p) => ({ ...p, phrases: p.phrases.filter((_, idx) => idx !== i) }));
  }

  function addStat() {
    setSettings((p) => ({
      ...p,
      stats: [...p.stats, { id: Math.random().toString(36).slice(2), value: '', label: '' }],
    }));
  }

  function updateStat(id: string, field: 'value' | 'label', val: string) {
    setSettings((p) => ({
      ...p,
      stats: p.stats.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    }));
  }

  function removeStat(id: string) {
    setSettings((p) => ({ ...p, stats: p.stats.filter((s) => s.id !== id) }));
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Hero Settings</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          <button onClick={save} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Headline */}
      <div className={styles.form} style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d3748', marginBottom: '1rem' }}>Headline</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Line 1</label>
            <input
              className={styles.input}
              value={settings.headline1}
              onChange={(e) => setSettings((p) => ({ ...p, headline1: e.target.value }))}
              placeholder="Master Chess."
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Line 2 (highlighted)</label>
            <input
              className={styles.input}
              value={settings.headline2}
              onChange={(e) => setSettings((p) => ({ ...p, headline2: e.target.value }))}
              placeholder="Master Life."
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description Paragraph</label>
          <textarea
            className={styles.textarea}
            value={settings.description}
            rows={3}
            onChange={(e) => setSettings((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
      </div>

      {/* Rotating Phrases */}
      <div className={styles.form} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d3748' }}>Rotating Phrases ("We Build → ___")</h2>
          <button onClick={addPhrase} className={`${styles.btn} ${styles.btnSecondary}`}>+ Add Phrase</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {settings.phrases.map((phrase, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                className={styles.input}
                value={phrase}
                onChange={(e) => updatePhrase(i, e.target.value)}
                placeholder="Strategic Thinking"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => removePhrase(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '1.1rem', lineHeight: 1, padding: '0 4px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.form}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d3748' }}>Hero Stats</h2>
          <button onClick={addStat} className={`${styles.btn} ${styles.btnSecondary}`}>+ Add Stat</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {settings.stats.map((stat) => (
            <div key={stat.id} className={styles.form} style={{ padding: '1rem', position: 'relative' }}>
              <button
                onClick={() => removeStat(stat.id)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '1rem', lineHeight: 1 }}
              >
                ×
              </button>
              <div className={styles.formGroup}>
                <label className={styles.label}>Value</label>
                <input className={styles.input} value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="2000+" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Label</label>
                <input className={styles.input} value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="Students Trained" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add src/app/admin/(cms)/hero/page.tsx
git commit -m "feat: add Hero Settings admin page"
```

---

## Task 9: Update Admin Sidebar

**Files:**
- Modify: `src/app/admin/AdminSidebar.tsx`

- [ ] Open `src/app/admin/AdminSidebar.tsx`. Find the `NAV` array and add the Hero Settings entry as the first item:

```ts
const NAV = [
  { href: '/admin/hero', label: 'Hero Settings', icon: '🏠' },
  { href: '/admin', label: 'Blog Posts', icon: '📝' },
  { href: '/admin/coaches', label: 'Coaches', icon: '👤' },
  { href: '/admin/achievements', label: 'Achievements', icon: '🏆' },
  { href: '/admin/stats', label: 'Stats', icon: '📊' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { href: '/admin/courses', label: 'Courses', icon: '📚' },
  { href: '/admin/curriculum', label: 'Curriculum', icon: '🗂' },
  { href: '/admin/contact', label: 'Contact Info', icon: '📞' },
  { href: '/admin/featured', label: 'Featured Post', icon: '⭐' },
  { href: '/admin/become-coach', label: 'Become a Coach', icon: '♟' },
];
```

- [ ] Commit:
```bash
git add src/app/admin/AdminSidebar.tsx
git commit -m "feat: add Hero Settings to admin sidebar"
```

---

## Task 10: Cleanup & Final Verification

**Files:**
- Delete: `public/design-preview.html`

- [ ] Delete the preview file:
```bash
rm /e/chaturangaveda/chessv3.0/public/design-preview.html
```

- [ ] Run a full TypeScript check:
```bash
cd /e/chaturangaveda/chessv3.0
npx tsc --noEmit 2>&1
```
Expected: no new errors introduced by these changes.

- [ ] Start the dev server and verify:
```bash
npm run dev
```
Check:
  - `http://localhost:3000` — hero shows editorial card; Home appears in navbar; Book Free Trial goes to `/book-free-trial`
  - `http://localhost:3000/book-free-trial` — booking page loads; has both calendar and WhatsApp options
  - `http://localhost:3000/become-a-coach` — name field is wider than phone field
  - `http://localhost:3000/admin/hero` — Hero Settings page loads with default values
  - `http://localhost:3000/admin/achievements` — each achievement shows ☆ / ★ Key toggle

- [ ] Commit cleanup:
```bash
git add -A
git commit -m "chore: remove design preview file; complete hero improvements"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Hero height overflow fix — Task 1
- ✅ Home link in desktop navbar — Task 2
- ✅ Book Free Trial → `/book-free-trial` — Task 2
- ✅ Editorial key achievement card (Option C) — Tasks 5, 6
- ✅ isKey selectable from admin — Task 4
- ✅ heroSettings admin page — Task 8
- ✅ Admin sidebar updated — Task 9
- ✅ Name field wider in become-a-coach — Task 3
- ✅ Cleanup — Task 10

**Type consistency:**
- `Achievement` interface defined once in HeroSection.tsx, referenced consistently across Tasks 6 and 7
- `HeroSettings` defined in HeroSection.tsx; home page.tsx passes compatible shape
- `isKey?: boolean` added to admin Achievement interface; `isKey` read in page.tsx home

**No placeholders:** All steps contain complete code. No TBDs.
