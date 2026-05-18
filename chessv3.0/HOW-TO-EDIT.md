# HOW TO EDIT THE CHATURANGVEDA WEBSITE

A complete, no-jargon-where-possible guide for the site owner / client to understand the project, find what they want to change, and make safe edits.

---

## TABLE OF CONTENTS

1. [What This Website Is](#1-what-this-website-is)
2. [The Two Ways To Make Changes](#2-the-two-ways-to-make-changes)
3. [Tech Stack — The Building Blocks](#3-tech-stack--the-building-blocks)
4. [Folder Layout — Where Everything Lives](#4-folder-layout--where-everything-lives)
5. [Running The Site Locally](#5-running-the-site-locally)
6. [Environment Variables (.env.local)](#6-environment-variables-envlocal)
7. [Admin Panel (CMS) — Day-To-Day Edits](#7-admin-panel-cms--day-to-day-edits)
8. [Pages — What Each Page Does And Where Its Code Lives](#8-pages--what-each-page-does-and-where-its-code-lives)
9. [Components — Reusable Building Blocks](#9-components--reusable-building-blocks)
10. [Styling, Colors, Fonts](#10-styling-colors-fonts)
11. [Editing Common Things — Recipes](#11-editing-common-things--recipes)
12. [Images & Uploads](#12-images--uploads)
13. [SEO, Metadata, Sitemap, Robots](#13-seo-metadata-sitemap-robots)
14. [Forms, Email & Payments](#14-forms-email--payments)
15. [The Database](#15-the-database)
16. [Security & The Admin Login](#16-security--the-admin-login)
17. [Deploying Changes](#17-deploying-changes)
18. [Editing With AI Assistance (Claude Code, Cursor, ChatGPT, etc.)](#18-editing-with-ai-assistance-claude-code-cursor-chatgpt-etc)
19. [Common Gotchas](#19-common-gotchas)
20. [Glossary](#20-glossary)

---

## 1. WHAT THIS WEBSITE IS

**Chaturangveda** — an online chess coaching academy for kids. The website (`chaturangveda.in`) does four things:

1. **Markets the academy** — homepage, coaches, curriculum, testimonials, achievements, blog.
2. **Captures leads** — "Book a Free Trial" form, "Become a Coach" application, contact form.
3. **Takes payments** — "Enroll" flow integrated with Razorpay.
4. **Lets you (the owner) edit content** — without touching code — via an Admin panel at `/admin`.

The actual student classes happen on a separate platform: `chaturangveda.wise.live` (the "Student Login" button in the navbar links there). This website does not host classes.

---

## 2. THE THREE WAYS TO MAKE CHANGES

There are three different ways to edit this site, and which one you use depends on **what** you're changing.

### A) Content edits — use the Admin Panel
Anything that's just text, numbers, images, or lists of things (coaches, testimonials, blog posts, prices, hero headline, etc.) → log in at **`/admin`** and edit there. No code required. Changes go live within a few minutes (some pages cache for up to 5 minutes).

### B) Structural / design edits — touch the code (manually)
Anything that's the **layout** of a page, the **navigation menu**, **colors**, **fonts**, adding a **brand-new page**, or changing **how a form works** → has to be done in the code under `src/`. Requires a developer (or careful editing by you + redeployment).

### C) Structural / design edits — with AI help
Same edits as (B), but you brief an AI assistant (Claude Code, Cursor, GitHub Copilot, ChatGPT) and it writes the code for you. **You don't need to know React.** You do need to know how to describe what you want, review the diff, and run `npm run build` to confirm it works. **See [Section 18](#18-editing-with-ai-assistance-claude-code-cursor-chatgpt-etc) for a full guide.**

A quick rule of thumb:

| If you want to change… | Use |
|---|---|
| Headline text, hero phrases, stats numbers | Admin panel → Hero |
| Add a new coach, update a bio, change a photo | Admin panel → Coaches |
| Add a blog post / edit one / unpublish one | Admin panel → Blog Posts |
| Add a student achievement | Admin panel → Achievements |
| Add / edit a testimonial | Admin panel → Testimonials |
| Add or edit a course price / description | Admin panel → Courses |
| Edit curriculum levels | Admin panel → Curriculum |
| Phone number, email, WhatsApp link | Admin panel → Contact Info |
| Pick which blog post is "featured" | Admin panel → Featured Post |
| Edit "Become a Coach" page content | Admin panel → Become a Coach |
| Edit the menu (Navbar) — add a new menu item | Code (`src/components/Navbar.tsx`) |
| Footer links, social icons | Code (`src/components/Footer.tsx`) |
| Color palette / fonts | Code (`src/app/globals.css`) |
| Add a new page (e.g. `/about-us`) | Code (new folder under `src/app/`) |
| SEO title, keywords, social-share image | Code (`src/app/layout.tsx` and each page's metadata) |

---

## 3. TECH STACK — THE BUILDING BLOCKS

You don't need to know how to write any of this, but it helps when talking to a developer:

| Layer | What we use | Why it matters to you |
|---|---|---|
| Framework | **Next.js 16** (React 19) | Renders pages. **This is a recent version** — don't blindly trust older Next.js tutorials. |
| Language | TypeScript | Catches bugs at build time. |
| Database | **MySQL** (managed cloud) | Stores blog posts, coaches, testimonials, etc. The connection string lives in `.env.local`. |
| Email | **EmailJS** + Gmail SMTP backup | Sends form submissions to your inbox. |
| Payments | **Razorpay** | Used on the `/enroll` page. |
| Auth | A simple admin password + JWT cookie | Protects `/admin` routes. |
| Hosting | **Vercel** (recommended) | Auto-deploys on every code push. |
| Animations | Framer Motion | Smooth motion on hero, sections, etc. |
| 3D scene | three.js / @react-three | The chessboard 3D scene on the homepage. |

---

## 4. FOLDER LAYOUT — WHERE EVERYTHING LIVES

Top level of `chessv3.0/`:

```
chessv3.0/
├── .env.local              ← SECRETS. Never commit this. Has DB password, Razorpay keys, etc.
├── .env.local.example      ← Template showing what variables are needed.
├── package.json            ← Lists all the libraries the project uses.
├── next.config.ts          ← Security headers, redirects, image rules.
├── public/                 ← Files served as-is (logos, uploads, robots.txt assets).
│   ├── chaturangveda_logo.png
│   ├── favicon.svg
│   ├── images/             ← Static images referenced from the site.
│   └── uploads/            ← Images uploaded through the Admin panel land here.
└── src/                    ← All the actual code.
    ├── app/                ← One folder per route/page (Next.js App Router).
    ├── components/         ← Reusable UI pieces (Navbar, Footer, HeroSection, etc.).
    ├── data/               ← Static JSON fallbacks (used if DB is empty).
    ├── lib/                ← Helper code: DB, email, sessions, image upload.
    ├── scripts/            ← One-off scripts (seed DB, migrate from Postgres to MySQL).
    └── proxy.ts            ← Middleware that protects /admin routes.
```

### Inside `src/app/` (the most important folder)

Every folder under `src/app/` is a URL on the live site. The file `page.tsx` inside that folder is what the visitor sees.

```
src/app/
├── page.tsx                ← Homepage (chaturangveda.in/)
├── layout.tsx              ← Wraps every page. Sets fonts + global metadata.
├── globals.css             ← Site-wide colors, fonts, spacing variables.
├── not-found.tsx           ← The 404 page.
├── robots.ts               ← Generated robots.txt (for search engines).
├── sitemap.ts              ← Generated sitemap.xml (for search engines).
│
├── coaches/                ← chaturangveda.in/coaches
├── curriculum/             ← chaturangveda.in/curriculum
├── services/               ← chaturangveda.in/services
├── contact/                ← chaturangveda.in/contact
├── become-a-coach/         ← chaturangveda.in/become-a-coach
├── book-free-trial/        ← chaturangveda.in/book-free-trial
├── enroll/                 ← chaturangveda.in/enroll (payment flow)
├── privacy-policy/         ← chaturangveda.in/privacy-policy
├── terms/                  ← chaturangveda.in/terms
├── blogs/
│   ├── page.tsx            ← Blog index (chaturangveda.in/blogs)
│   └── [slug]/page.tsx     ← Individual blog post page (the [slug] is dynamic)
│
├── admin/                  ← The CMS. Password-protected.
│   ├── login/              ← Login screen.
│   └── (cms)/              ← One folder per editable section.
│       ├── hero/           ← Edit homepage hero text/phrases/stats.
│       ├── coaches/        ← Manage coach profiles.
│       ├── achievements/   ← Student trophies / wins.
│       ├── stats/          ← The "2000+ students" stat strip.
│       ├── testimonials/   ← Parent testimonials.
│       ├── courses/        ← Pricing/courses on the Services page.
│       ├── curriculum/     ← The 5-level curriculum.
│       ├── contact/        ← Phone, email, WhatsApp, address.
│       ├── featured/       ← Which blog post is shown as "featured".
│       ├── posts/          ← Blog post create/edit screens.
│       └── become-coach/   ← "Become a Coach" page content.
│
└── api/                    ← Backend endpoints. Forms POST here; admin saves here.
    ├── contact/            ← Receives free-trial form submissions.
    ├── coach-apply/        ← Receives coach applications.
    ├── enroll/             ← Razorpay payment endpoints.
    ├── posts/              ← Blog post create/read/update/delete.
    └── admin/
        ├── login/          ← Verifies admin password.
        ├── logout/         ← Clears admin cookie.
        ├── content/[key]/  ← Generic save/load for any content section.
        └── upload/         ← Receives uploaded images.
```

### Inside `src/components/`

These are the **building blocks** that the pages mix and match.

| File | What it is | Used on |
|---|---|---|
| `Navbar.tsx` | The top navigation bar (logo, menu, "Book Free Trial" button) | Every page |
| `Footer.tsx` | The bottom footer (links, copyright) | Every page |
| `HeroSection.tsx` | The big "Master Chess. Master Life." block | Homepage |
| `AnimatedTextBanner.tsx` | The scrolling banner ("FIDE-Rated · 10+ Years…") | Homepage |
| `StatsSection.tsx` | The "2000+ Students Trained" number strip | Homepage |
| `FeaturesSection.tsx` | "Why Chaturangveda" feature cards | Homepage |
| `CoursesSection.tsx` | Courses preview cards | Homepage |
| `BenefitsSection.tsx` | "Benefits to your child" section | Homepage |
| `TestimonialsSection.tsx` | Parent testimonial carousel | Homepage |
| `CTASection.tsx` | "Ready to start?" call-to-action | Homepage |
| `ChessScene.tsx` | The 3D chess piece (hero background) | Homepage |
| `JsonLd.tsx` | Injects search-engine schema data | Used inside pages |
| `OrganizationSchema.tsx` | Tells Google what kind of business we are | Layout (every page) |

Each component has a sibling `*.module.css` file that styles only that component (scoped CSS — won't leak elsewhere).

---

## 5. RUNNING THE SITE LOCALLY

You need this to preview changes before they go live.

**Prerequisites (one-time):**
- Install [Node.js](https://nodejs.org/) (LTS version, currently 20.x or 22.x).
- A code editor — VS Code is the standard.
- The `.env.local` file (your developer should give it to you; never commit it to git).

**Every time you want to run it:**

Open a terminal **inside `chessv3.0/`** and run:

```bash
npm install     # only the first time, or after dependencies change
npm run dev     # starts the local server
```

Then open `http://localhost:3000` in a browser. The admin is at `http://localhost:3000/admin`.

**Available scripts** (defined in `package.json`):

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local development server. Hot-reloads on save. |
| `npm run build` | Builds the production version. Must succeed before deploy. |
| `npm run start` | Runs the production build locally (after `build`). |
| `npm run lint` | Static-checks the code for problems. |
| `npm run seed` | Populates the database with the initial content (one-time setup). |

---

## 6. ENVIRONMENT VARIABLES (.env.local)

This file is **secret**. It is *not* committed to git. Look at `.env.local.example` to see what's expected. Variables explained:

| Variable | Purpose |
|---|---|
| `DB_CONN` | MySQL connection string. Format: `mysql://user:password@host:3306/database`. Special chars in the password (`@`, `:`, `$`) must be URL-encoded (`%40`, `%3A`, `%24`). |
| `ADMIN_PASSWORD` | The password used to log in at `/admin`. Set this to something strong. |
| `SESSION_SECRET` | A random 32+ char string used to sign the admin login cookie. Change it = logs everyone out. |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + **App Password** (not your real password — generate at https://myaccount.google.com/apppasswords). Used as a fallback to send notification emails. |
| `OWNER_EMAIL` | The inbox that receives form notifications. |
| `EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` / `_PRIVATE_KEY` | EmailJS account credentials — the primary way forms get sent to you. |
| `RAZORPAY_KEY_ID` / `_SECRET` | Razorpay server-side keys. **Secret** — never share. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay client-side key. Safe to expose (loads in the browser). |
| `NEXT_PUBLIC_SITE_URL` | The full URL of the live site, e.g. `https://chaturangveda.in`. Used for SEO links. |

**Anything that starts with `NEXT_PUBLIC_` is visible to the browser.** Never put a secret behind that prefix.

When deployed to Vercel, you set these in **Vercel → Project → Settings → Environment Variables** — not in the file.

---

## 7. ADMIN PANEL (CMS) — DAY-TO-DAY EDITS

### How to log in

1. Go to `https://chaturangveda.in/admin/login` (or `localhost:3000/admin/login` locally).
2. Enter the admin password (`ADMIN_PASSWORD` from the env file).
3. You're now logged in for 7 days. Click "Logout" in the sidebar to end early.

After 5 failed login attempts from the same IP within 15 minutes, that IP is locked out for 15 minutes (anti-brute-force).

### The sidebar — what each section does

| Sidebar item | What it edits | Where it shows up on the site |
|---|---|---|
| 🏠 **Hero Settings** | Headline lines, the rotating phrases ("We build → Strategic Thinking"), the 4 stats. | Top of homepage. |
| 📝 **Blog Posts** | All blog posts (create / edit / delete / publish / unpublish). | `/blogs` and `/blogs/[slug]`. |
| 👤 **Coaches** | Coach name, title, FIDE rating, experience, specialties, bio (Markdown), photo, photo focus. | `/coaches` page. |
| 🏆 **Achievements** | Student names, achievement, event, year, photo, badge, "key" flag. | Hero on homepage (featured), and the achievements grid. |
| 📊 **Stats** | The big number strip ("2000+ Students Trained"). | Homepage stats section. |
| 💬 **Testimonials** | Parent name, child name, quote, rating (stars). | Homepage testimonials carousel. |
| 📚 **Courses** | Each course's name, price, description, features. | `/services` and homepage. |
| 🗂 **Curriculum** | The 5 levels (Foundation, Beginner, etc.) — names, descriptions, topics. | `/curriculum`. |
| 📞 **Contact Info** | Phone, email, WhatsApp number, address. | Footer + `/contact`. |
| ⭐ **Featured Post** | Pick which blog post is the "featured" one on `/blogs`. | `/blogs` page hero. |
| ♟ **Become a Coach** | Content of the `/become-a-coach` page (job pitch, requirements, perks). | `/become-a-coach`. |

### How saving works (technical, but useful to know)

- Each section is stored as **one JSON blob** under a `key` in the MySQL `site_content` table.
  - Example: clicking "Save" on Hero saves a row with `key = 'hero-settings'` and `value = { headline1, headline2, phrases, stats }`.
- The homepage **caches** this data for **5 minutes** (Next.js `unstable_cache`). After saving, wait ~5 min for the change to show up on the live homepage. Blog posts and most other pages refresh faster.
- If the database is empty or unreachable, pages fall back to **hard-coded defaults** in the component files (so the site never breaks).

### Markdown — what it is and where it's used

Markdown is a simple way to write formatted text. The bio fields (coaches), blog post body, "Become a Coach" content, and a few others use it.

| Markdown | Result |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `# Heading` | Big heading |
| `## Subheading` | Smaller heading |
| `- item` | Bullet point |
| `[link text](https://example.com)` | A link |
| `![alt](image.jpg)` | An embedded image |

The Markdown editor in the admin panel has a preview button so you can see how it'll look.

---

## 8. PAGES — WHAT EACH PAGE DOES AND WHERE ITS CODE LIVES

| URL | Folder | What you can edit there |
|---|---|---|
| `/` | `src/app/page.tsx` | Page structure (which sections appear in what order). For *content* of sections, use Admin → Hero/Stats/etc. |
| `/coaches` | `src/app/coaches/page.tsx` | Layout. Coach data comes from Admin → Coaches. |
| `/curriculum` | `src/app/curriculum/page.tsx` | Layout. Content from Admin → Curriculum. |
| `/services` | `src/app/services/page.tsx` | Layout + headings. Course list comes from Admin → Courses. |
| `/contact` | `src/app/contact/page.tsx` | Layout + form fields. Contact details from Admin → Contact Info. |
| `/book-free-trial` | `src/app/book-free-trial/page.tsx` | The form itself (fields) is here. Submissions go through `/api/contact`. |
| `/become-a-coach` | `src/app/become-a-coach/page.tsx` | Layout. Content from Admin → Become a Coach. Form posts to `/api/coach-apply`. |
| `/enroll` | `src/app/enroll/page.tsx` | Payment flow code. **Be very careful editing.** |
| `/blogs` | `src/app/blogs/page.tsx` | Blog listing layout. Posts from DB. |
| `/blogs/[slug]` | `src/app/blogs/[slug]/page.tsx` | Single-post layout. Post content from DB. |
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | **Plain HTML/JSX.** Edit directly to change policy text. |
| `/terms` | `src/app/terms/page.tsx` | **Plain HTML/JSX.** Edit directly to change T&C. |
| 404 page | `src/app/not-found.tsx` | The page shown for broken/missing URLs. |

### Anatomy of a page file

Each `page.tsx` typically has:
1. **Imports** at the top (React, components, helpers).
2. **`export const metadata`** — sets the browser tab title + SEO description for that page.
3. **`export default function PageName()`** — the actual JSX (the visible content).

If you want to change the **tab title** or **SEO description** of one page, edit its `metadata` block.

---

## 9. COMPONENTS — REUSABLE BUILDING BLOCKS

Each component is a self-contained chunk of UI. You change it once, it updates everywhere it's used.

**Anatomy of a component (e.g. `Navbar.tsx`)**:
```
src/components/Navbar.tsx          ← The code (what to render)
src/components/Navbar.module.css   ← The styles for just this component
```

**Editing the menu items in the navbar** — open `src/components/Navbar.tsx` and look for the `links` array:

```ts
const links = [
  { label: 'Coaches', href: '/coaches' },
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];
```

Add or remove entries here. To change the "Services" dropdown, edit `serviceDropdownItems` above it. To change the LMS URL (the "Student Login" button), edit `LMS_URL`.

**Editing the footer** — open `src/components/Footer.tsx` and adjust similarly.

---

## 10. STYLING, COLORS, FONTS

### The global stylesheet — `src/app/globals.css`

The very top of this file is the **design system**. Variables like:

```css
--primary: #004D99;            /* main brand blue */
--primary-container: #1565C0;  /* slightly lighter blue */
--surface: #F7F9FB;            /* page background */
--font-heading: var(--font-space-grotesk);
--font-body: var(--font-manrope);
--section-padding: 120px 0;
--container-width: 1200px;
--border-radius: 12px;
```

**Changing a brand color** = change the value once at the top of `globals.css`. Every component that uses `var(--primary)` will update.

### Fonts

Loaded in `src/app/layout.tsx` via Next's Google-Fonts integration. To change the heading font:
1. Pick a font from [fonts.google.com](https://fonts.google.com).
2. In `layout.tsx`, swap the import and update the `--font-space-grotesk` variable.

### Per-component styles

Each component has a `.module.css` file. These styles only affect that component. Safe to edit without breaking other pages.

---

## 11. EDITING COMMON THINGS — RECIPES

### Recipe: Change the main headline ("Master Chess. Master Life.")

→ Admin panel → **Hero Settings** → edit "Line 1" and "Line 2" → Save All. Wait ~5 min for the homepage to update (cache).

### Recipe: Change the rotating phrases ("We build → Strategic Thinking → …")

→ Admin → Hero Settings → "Rotating Phrases" → add / remove / edit. Save.

### Recipe: Update the stats numbers ("2000+ Students Trained")

→ Admin → Hero Settings → "Hero Stats" section. Each row has `value` (e.g. `2000+`) and `label` (e.g. `Students Trained`). Save.

### Recipe: Add a new coach

→ Admin → Coaches → "+ Add Coach" → fill in name, title, FIDE rating, experience, specialties, photo (drag & drop), and bio (Markdown). Save.

### Recipe: Add a blog post

→ Admin → Blog Posts → "+ New Post" → fill in title, slug (auto-generated from title), excerpt, body (Markdown), featured image, category, tags. Toggle "Published" if you want it live immediately. Save.

### Recipe: Unpublish (hide) a blog post

→ Admin → Blog Posts → click "Edit" on the post → uncheck "Published" → Save. It stays in the DB but hides from `/blogs`.

### Recipe: Add a student achievement / trophy

→ Admin → Achievements → "+ Add Achievement" → fill in name, achievement, event, year, photo, badge emoji. Tick "isKey" on the single most important one — that becomes the **featured** champion on the hero.

### Recipe: Add a testimonial

→ Admin → Testimonials → enter parent name, child's name (optional), the quote, and 1–5 star rating. Save.

### Recipe: Change pricing

→ Admin → Courses → click the course → edit price / description. The page **`/services`** displays this.

### Recipe: Change phone number / WhatsApp / email everywhere on the site

→ Admin → Contact Info → update. Affects the footer, contact page, and structured data shown to Google.

### Recipe: Add a menu item to the navbar (CODE EDIT)

→ Open `src/components/Navbar.tsx`. Find the `links` array. Add a new entry:
```ts
{ label: 'About Us', href: '/about-us' },
```
Save. Note: you also need to *create* the page at `src/app/about-us/page.tsx` for the link to work.

### Recipe: Add a new page (CODE EDIT)

→ Create a folder under `src/app/`, e.g. `src/app/about-us/`. Add a `page.tsx` file in it:
```tsx
export const metadata = {
  title: 'About Us',
  description: 'About Chaturangveda chess academy.',
};

export default function AboutUsPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>Your content here.</p>
    </main>
  );
}
```
Done — `/about-us` now exists. Add it to the navbar (recipe above) if you want it linked.

### Recipe: Change the privacy policy or terms

→ Open `src/app/privacy-policy/page.tsx` (or `terms/page.tsx`). Edit the JSX directly — it's just paragraphs and headings.

### Recipe: Change the admin login password

→ Edit `.env.local` (locally) **and** the Vercel environment variables (for production). Change `ADMIN_PASSWORD`. Redeploy.

---

## 12. IMAGES & UPLOADS

### Where images come from

There are 3 sources:

1. **`public/`** — images shipped with the codebase (logo, favicon, default images). Path on the site: `/chaturangveda_logo.png` etc.
2. **`public/uploads/`** — images uploaded through the Admin panel (coach photos, blog featured images, achievement photos). Auto-named with a timestamp so no collisions.
3. **`public/images/`** — older legacy images. Still served.

### How to upload through Admin

Wherever you see a photo field in the admin, you can drag-and-drop or click. Restrictions:
- **Allowed types**: JPG, PNG, WebP, GIF, AVIF.
- **Max size**: 5 MB per image.

The image gets saved into `public/uploads/` with a random name and the URL (e.g. `/uploads/1738320920-ab12cd.png`) gets stored in the DB.

**Production note**: on Vercel, the filesystem is read-only. Uploads work locally but **need an object storage backend (S3, Cloudinary, Vercel Blob) in production**. If you're seeing upload failures on the live site, that's why — your developer should switch `src/lib/image-upload.ts` to use a cloud bucket.

### How to replace the logo

→ Drop the new file at `public/chaturangveda_logo.png` (same name). Done.

### How to optimize images

Next.js auto-optimizes images shown via the `<Image>` component (most of them are). Just upload original-quality images; the framework resizes them. Don't pre-shrink to 800×600 — let Next do it.

---

## 13. SEO, METADATA, SITEMAP, ROBOTS

### Per-page title and description

Each `page.tsx` exports a `metadata` block. To change the homepage tab title and Google snippet:

→ Open `src/app/layout.tsx`. Find `export const metadata`. Edit `title.default` and `description`.

For a specific page (e.g. `/coaches`), edit `metadata` inside `src/app/coaches/page.tsx`.

### Keywords list

In `layout.tsx`, the `keywords` array has all the SEO terms for the site. Add/remove as needed.

### Social-share preview

The `openGraph` and `twitter` blocks in `layout.tsx` control what shows up when the site is shared on WhatsApp, Facebook, X, etc. The image (`/chaturangveda_logo.png`) is what appears in the preview card.

### Sitemap & robots.txt

- `src/app/sitemap.ts` — auto-generates `/sitemap.xml` listing every page (homepage, coaches, blog posts pulled from DB, etc.).
- `src/app/robots.ts` — auto-generates `/robots.txt` telling search engines what they can crawl.

If you add a new page and want it in the sitemap, add it manually in `sitemap.ts`.

### Schema.org structured data

`src/components/OrganizationSchema.tsx` and the inline `JsonLd` blocks in `page.tsx` tell Google specifics — your business is an EducationalOrganization, your coaches are Persons, your courses are Courses, etc. Update phone numbers / addresses / coach names here if they change.

### Google Search Console verification

The verification token sits in `layout.tsx` under `verification.google`. Your developer set this up — leave it alone unless reverifying.

---

## 14. FORMS, EMAIL & PAYMENTS

### How the "Book a Free Trial" form works

1. User fills out the form on `/book-free-trial`.
2. Browser sends the data to `/api/contact` (code: `src/app/api/contact/route.ts`).
3. Server calls **EmailJS** which forwards the message to `OWNER_EMAIL`.
4. The user gets a success message.

If form submissions stop arriving:
- Check EmailJS dashboard — has the monthly quota been hit?
- Check the EmailJS credentials in `.env.local` / Vercel env vars.
- Look at the server logs on Vercel (Functions → /api/contact).

### How "Become a Coach" works

Same flow but posts to `/api/coach-apply`.

### How the enroll / payment flow works

1. User on `/enroll` selects a plan and clicks "Pay".
2. Browser hits `/api/enroll` → server creates a Razorpay order using `RAZORPAY_KEY_SECRET`.
3. The Razorpay checkout popup opens (uses `NEXT_PUBLIC_RAZORPAY_KEY_ID`).
4. After payment, browser POSTs to `/api/enroll/verify` to confirm the payment signature is legit.
5. On success, user sees a confirmation.

**Do not edit the enroll flow without testing carefully** — broken payment = lost revenue.

### How emails actually leave

Primary: **EmailJS** (a third-party that sends mail from a template).
Fallback: Gmail SMTP via Nodemailer (using the SMTP_USER / SMTP_PASS app password).

You can switch the recipient at any time by changing `OWNER_EMAIL`.

---

## 15. THE DATABASE

You don't need to touch the DB directly — the admin panel is the interface. But for reference:

### Tables

1. **`posts`** — blog posts.
   - Columns: `id, slug, title, excerpt, content, author, author_image, date, image, category, tags, read_time, featured, published, created_at`.
2. **`site_content`** — everything else.
   - Two columns only: `key` (e.g. `hero-settings`, `coaches`, `testimonials`) and `value` (a JSON blob).
   - This is **why the CMS is so flexible** — adding a new section is just adding a new key.

### Schema migrations

Live in `src/lib/migrations/`. Currently:
- `002_site_content.sql` — creates the `site_content` table.

### Seeding (filling the DB with initial content)

```bash
npm run seed
```
Runs `src/scripts/seed-db.ts` which populates the DB with defaults.

There's also `src/scripts/copy-to-test-db.ts` for cloning prod → test, and `src/scripts/migrate-postgres-to-mysql.ts` (used once historically — the project moved from Postgres to MySQL).

---

## 16. SECURITY & THE ADMIN LOGIN

### How admin auth works

1. POST password to `/api/admin/login`.
2. Server checks against `ADMIN_PASSWORD` env var.
3. If correct, server signs a JWT with `SESSION_SECRET` and sets it as a **secure HTTP-only cookie** (`cv-admin-session`).
4. On every request to `/admin/*`, `src/proxy.ts` (middleware) verifies the cookie. No cookie or invalid cookie → redirect to login.
5. Sessions last **7 days**.

### Rate limiting

5 wrong attempts in 15 min per IP = locked out for the rest of the window.

### Security headers

`next.config.ts` sets HSTS, X-Frame-Options DENY, a strict Content-Security-Policy, etc. Don't relax these without good reason — they protect against clickjacking, XSS, and mixed-content issues.

### Things NOT to do

- Never commit `.env.local` to git.
- Never put a secret in a `NEXT_PUBLIC_*` variable.
- Never log the user's password.
- Never disable the CSP to make a third-party widget work — instead, add the specific domain to the allowed list.

---

## 17. DEPLOYING CHANGES

### If hosted on Vercel (recommended)

The repo is connected to Vercel. **Every push to the `master` branch** triggers an automatic build and deploy. The `dev` branch (current) is for staging.

Workflow:
1. Make changes locally (test with `npm run dev`).
2. Commit: `git commit -m "your message"`.
3. Push: `git push`.
4. Watch Vercel dashboard — the build runs, and the new version goes live in 1–3 minutes.

If the build fails (red X in Vercel dashboard), open the build logs and fix the error. The most common reason: a typo causes TypeScript to complain.

### Manual / VPS deployment

```bash
npm install
npm run build
npm run start
```
This runs the production server on port 3000. Usually paired with a process manager (PM2) and a reverse proxy (nginx).

### Custom domain

Configured in Vercel → Project → Settings → Domains. Both `chaturangveda.in` (canonical) and `www.chaturangveda.in` (redirects to non-www, configured in `next.config.ts`) should be set up.

---

## 18. EDITING WITH AI ASSISTANCE (CLAUDE CODE, CURSOR, CHATGPT, ETC.)

You don't need to learn React to make code-level changes — modern AI coding tools can do it for you if you brief them well. This section covers **which tool to use, how to set it up, how to talk to it, and how to avoid catastrophic mistakes.**

### 18.1 The landscape — which AI tool does what

| Tool | What it is | Best for | Cost |
|---|---|---|---|
| **Claude Code** (Anthropic) | A terminal/CLI agent that reads your codebase, runs commands, and makes file edits. | Multi-file refactors, "do this entire task end-to-end," running the dev server and verifying. **The most capable for this project.** | Paid (Claude Pro / Max / API). |
| **Cursor** | A VS Code fork with a built-in AI chat that can edit files inline. | Visual editing, accepting/rejecting individual diff hunks, day-to-day work. | Free tier; Pro for $20/mo. |
| **GitHub Copilot** | Autocomplete + chat inside VS Code. | Tab-completion as you type, small inline edits. | $10/mo. |
| **ChatGPT / Claude.ai web** | A browser chat. You paste code; it gives code back. | Quick "explain this" or "rewrite this snippet" — but **no direct file access** so you have to paste/copy manually. | Free tier; Plus $20/mo. |
| **Windsurf / Codeium** | Similar to Cursor. | Alternative if you don't like Cursor. | Free tier; Pro $15/mo. |

**Recommendation for this project**: **Claude Code** for big tasks ("redesign the contact form", "add a new page"), and **Cursor** for live tweaking. The two work well together.

### 18.2 One-time setup

#### A) Install Claude Code

1. Sign up at [claude.com](https://claude.com).
2. Open your terminal and run:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
3. Navigate to the project:
   ```bash
   cd E:\chaturangaveda\chessv3.0
   ```
4. Run:
   ```bash
   claude
   ```
5. Follow the prompts to authenticate. You're in.

#### B) Install Cursor (optional)

1. Download from [cursor.com](https://cursor.com).
2. Open the `chessv3.0` folder in Cursor.
3. Press `Ctrl+L` to open the AI chat sidebar; press `Ctrl+K` to inline-edit highlighted code.

#### C) Tell the AI about the project (CRITICAL)

The codebase already has a file the AI will read automatically: **`AGENTS.md`** (and `CLAUDE.md`, which points to it). It contains this important warning:

> *"This is NOT the Next.js you know — this version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."*

This is because the project uses **Next.js 16**, which has differences from older tutorials the AI was trained on. **Always remind the AI of this in your first message** if it's making mistakes. Tell it: *"This project uses Next.js 16 (App Router, React 19). Don't assume older Next.js conventions."*

### 18.3 How to talk to AI tools (prompting basics)

A bad prompt: *"fix the homepage"*
A good prompt: *"On the homepage hero, the rotating phrases overlap on mobile screens narrower than 380px. Read `src/components/HeroSection.tsx` and its CSS module, then adjust the typography or layout so phrases fit cleanly on small screens. Don't change the desktop appearance."*

**The 5 rules of good AI prompts:**

1. **Be specific about WHAT** — which file, which element, which behavior. AI cannot read your mind.
2. **Be specific about WHY** — what's the problem you're solving? "Phone number is wrong" vs. "Need to update the phone number from 75691 94709 to a new number 99887 76655 wherever it appears."
3. **Tell it what NOT to break** — "don't touch the desktop layout", "don't change the database schema", "keep the existing form fields".
4. **Ask it to read first** — for unfamiliar code, say *"first read X and Y to understand the existing pattern, then make the change."* Stops it from hallucinating.
5. **Ask it to verify** — for visual changes: *"run `npm run dev` and confirm the change works in the browser before declaring done."*

### 18.4 What AI is GREAT at on this project

- ✅ **Adding new pages** — "Add an `/about-us` page following the same pattern as `/privacy-policy`."
- ✅ **Adding menu items** — "Add an 'About' link to the navbar pointing to `/about-us`."
- ✅ **Styling tweaks** — "Make the hero headline larger on tablets" / "Change all secondary buttons to outlined style."
- ✅ **Adding new admin CMS sections** — "Add a new admin section under `(cms)/awards/` that follows the same pattern as `(cms)/achievements/`."
- ✅ **Writing blog posts in Markdown** — feed it a topic + tone, get a draft you can paste into the admin.
- ✅ **Refactoring CSS** — "These three components have duplicated card styles — extract them into a shared utility class in `globals.css`."
- ✅ **Fixing TypeScript errors** — paste the error, it'll usually fix it.
- ✅ **Generating SEO copy** — "Write a 160-character meta description for the curriculum page that includes 'FIDE-rated' and 'kids chess coaching'."
- ✅ **Updating dependencies** — "Run `npm outdated`, then upgrade non-breaking minor versions."

### 18.5 What AI is BAD at on this project (and why)

- ❌ **Razorpay / payment flow changes** — sensitive money logic. An AI hallucination here = lost revenue or refund chaos. Always have a human review payment code.
- ❌ **The DB schema** — adding columns or migrations needs human judgment (downtime, data loss risk).
- ❌ **Security headers (CSP)** — AI tends to "fix" CSP errors by weakening it, which defeats the purpose. Tighten, never loosen.
- ❌ **Anything that runs only in production** — uploads on Vercel, redirects, env vars. AI can't test these locally.
- ❌ **Multi-step git operations** — let it suggest commands, don't let it auto-run `git reset --hard`, `git push --force`, etc.
- ❌ **Replacing real student names / testimonials with placeholders** — sometimes AI "cleans up" by replacing real names with `John Doe`. Always diff carefully.

### 18.6 Recipes — common edits with AI prompts you can copy

Below are prompts you can paste directly. Replace the bracketed parts.

#### Recipe: Add a new menu item

> *Open `src/components/Navbar.tsx`. Add a new link labeled "[About]" pointing to `/[about]`. Place it between "Curriculum" and "Blog". Also create a new page at `src/app/[about]/page.tsx` following the same structure as `src/app/privacy-policy/page.tsx` — same metadata pattern, same layout. The page content should be: "[paste your content here]". Test that it builds with `npm run build` after.*

#### Recipe: Change brand color

> *In `src/app/globals.css`, change the `--primary` color from `#004D99` to `[#NEW_HEX]`. Then scan the codebase for any hard-coded uses of the old hex (not the CSS variable) and replace those too. Don't change `--primary-fixed` or `--primary-container` unless they look visually broken after.*

#### Recipe: Add a new section to the homepage

> *On the homepage (`src/app/page.tsx`), add a new section called "FAQ" between the `TestimonialsSection` and `CTASection`. Create the component at `src/components/FAQSection.tsx` (and a matching `.module.css`). It should display 5 FAQ items as collapsible accordions. The data should come from the admin panel under the key `homepage-faq` — extend `src/app/admin/(cms)/` with a new folder `homepage-faq/` following the same pattern as `(cms)/testimonials/`. Use `getContent` from `@/lib/content` to load the data. This is Next.js 16 — do not assume older conventions.*

#### Recipe: Fix something that's broken on mobile

> *On the homepage hero, the [describe what's broken] on screens narrower than [px]. Read `src/components/HeroSection.tsx` and `HeroSection.module.css`. Make the minimum change needed to fix it on mobile without altering tablet (≥768px) or desktop appearance. Run `npm run dev` and verify before finishing.*

#### Recipe: Write a new blog post

> *Write a 1200-word blog post titled "[Title]" aimed at parents of 6–10 year olds considering chess coaching. Tone: warm, expert, no jargon. Include: [bullet point topics]. Format as Markdown with H2 subheadings. Include 3–5 internal links to `/curriculum`, `/coaches`, `/book-free-trial`. End with a call-to-action linking to `/book-free-trial`.*

Then paste the result into Admin → Blog Posts → New.

#### Recipe: Find where something is defined

> *Where in the codebase is the [thing, e.g. "5-minute homepage cache"] defined? List the file paths and line numbers.*

Useful when you need to make a code change but don't know where to start.

#### Recipe: Explain a file

> *Read `src/lib/[file].ts` and explain in plain English what it does, who calls it, and what would break if I deleted it.*

#### Recipe: Migrate to cloud image storage (the Vercel upload gotcha from Section 12)

> *Currently `src/lib/image-upload.ts` writes to `public/uploads/`. This breaks on Vercel because the filesystem is read-only. Migrate it to use Vercel Blob storage. Update the function to upload to a blob, store the public URL, and return that URL. Add `@vercel/blob` to `package.json`. Add the required env vars to `.env.local.example` with placeholder values. Don't break the local-dev experience — fall back to the filesystem if `BLOB_READ_WRITE_TOKEN` is not set.*

### 18.7 The "context window" — why long prompts sometimes fail

AI tools have a limited memory per conversation (the "context window"). On a big task spanning many files, the AI may "forget" the earlier instructions.

**Symptoms**: It starts contradicting earlier guidance, repeating itself, or making mistakes in code it had previously read correctly.

**Fixes**:
- Start a **new conversation** for each big task. Don't stretch one chat for days.
- For very large refactors, **break the task into pieces** — "first do X, then I'll start a new chat for Y."
- For Claude Code specifically, use `/compact` to compress the conversation when it gets long.

### 18.8 The MUST-DO safety rituals

Treat AI as a fast junior developer. Brilliant but occasionally confidently wrong. **Always:**

1. **Use git before AI touches anything.**
   Before a session: `git status` should be clean, or all changes committed. So you can `git diff` afterward and see exactly what the AI changed, and `git revert`/`git checkout .` if it went sideways.

2. **Diff before you trust.**
   ```bash
   git diff
   ```
   Read every changed line. If anything looks unfamiliar, ask the AI: *"Why did you change line X in file Y? I didn't ask for that."*

3. **Build before you commit.**
   ```bash
   npm run build
   ```
   If this fails, the deploy will fail. AI sometimes writes code that *looks* right but doesn't compile.

4. **Test the actual feature** in the browser at `localhost:3000`. AI declaring "done" ≠ working in practice. Click the button. Submit the form. Check both desktop and mobile (use DevTools device toolbar).

5. **Commit in small chunks** with clear messages. Don't let one commit span 20 unrelated changes — if something breaks 3 days later, you want to bisect easily.

6. **Never let AI run destructive commands unsupervised.**
   Specifically: `rm -rf`, `git reset --hard`, `git push --force`, `DROP TABLE`, `DELETE FROM`. If the AI suggests these, read carefully before approving.

7. **Keep secrets out of prompts.**
   Don't paste your `.env.local` into ChatGPT. Don't paste real customer data. Reference files by path, not content, when sensitive data is involved.

8. **Don't blindly trust AI on the Next.js 16 specifics.**
   The AI was trained mostly on older Next.js. If it suggests something that smells like Pages Router (`pages/index.js`, `getServerSideProps`, `getStaticProps`) — wrong. We use **App Router** (`app/`, async server components, `unstable_cache`). Push back.

### 18.9 When AI is overkill — just use the Admin Panel

If your change is:
- Updating a price
- Changing a phone number
- Adding a new coach
- Writing a blog post
- Updating a testimonial

… **don't use AI.** Log into `/admin` and use the form. It's faster, safer, and doesn't require a deploy.

Reach for AI when you need to change **structure**, **layout**, **design**, **functionality**, or anything else that requires a code change.

### 18.10 A reasonable AI workflow for non-technical owners

1. Open the project folder in **Cursor** (or VS Code with Copilot installed).
2. Open a terminal inside it. Start the dev server: `npm run dev`. Leave it running.
3. Open `localhost:3000` in a browser. Leave it open.
4. In the AI chat panel, describe the change you want — be specific (use the recipes above as templates).
5. AI proposes file edits. **Review the diff** in the editor.
6. Click "Accept" if it looks right; "Reject" if not.
7. Look at the browser — the change should appear within a second (hot reload).
8. If it looks good: in the terminal, run `npm run build` to confirm it'll deploy cleanly.
9. Commit and push:
   ```bash
   git add .
   git commit -m "describe what changed"
   git push
   ```
10. Watch Vercel build + deploy. Done.

If something at step 7 looks wrong: tell the AI specifically what's wrong ("the heading is now too big on desktop"), and iterate.

### 18.11 Asking AI to explain the codebase to you

Great learning tool. Try these:

> *Walk me through what happens when a user clicks "Book Free Trial" — from the moment they fill the form to the moment an email arrives in my inbox. Reference exact files and functions.*

> *Explain how the admin login works. What stops someone from just typing `/admin` in the URL?*

> *I want to understand how the homepage gets its data. Trace it from the database to the screen.*

These give you real architectural understanding — much more valuable than any tutorial.

---

## 19. COMMON GOTCHAS

1. **"I edited the homepage but my change isn't showing."**
   The homepage caches DB data for **5 minutes** (`unstable_cache` with `revalidate: 300`). Wait, or trigger a redeploy.

2. **"The admin won't let me log in."**
   - Wrong password? Check `ADMIN_PASSWORD` env var.
   - Rate-limited? Wait 15 min or use a different network.
   - Session cookie issue? Try an incognito tab.

3. **"Image upload fails on the live site but works locally."**
   Vercel's file system is read-only at runtime. Switch `src/lib/image-upload.ts` to use cloud storage (S3, Cloudinary, Vercel Blob).

4. **"The 'Book Free Trial' email isn't arriving."**
   - Check spam folder.
   - Check EmailJS quota / dashboard.
   - Vercel → Functions → /api/contact → look at logs for error messages.

5. **"I changed a coach in admin but the homepage still shows the old one."**
   Homepage caches for 5 minutes. The `/coaches` page may update faster. Wait or redeploy.

6. **"Razorpay says 'order failed'."**
   - Are you using `rzp_test_*` keys in production? Switch to live keys.
   - Are env vars set in Vercel?
   - Check the Razorpay dashboard for the specific error.

7. **"TypeScript build errors after I edited a file."**
   Run `npm run build` locally first — never push without it succeeding.

8. **"My change broke the whole site."**
   - Revert via git: `git revert HEAD` then push.
   - Or: in Vercel → Deployments → click the previous green deployment → "Promote to Production".

9. **"I added a page but it 404s."**
   The file must be named `page.tsx` (not `Page.tsx`, not `index.tsx`), inside a folder named exactly as you want the URL.

10. **"The favicon didn't update."**
    Browsers cache favicons aggressively. Hard-refresh (Ctrl+Shift+R), or rename the file.

---

## 20. GLOSSARY

- **Next.js**: the framework. Think of it as the engine that turns code into a website.
- **App Router**: the routing system where folder structure = URL structure.
- **Component**: a reusable piece of UI (button, navbar, hero, etc.).
- **CSS Module**: a stylesheet whose class names are scoped to one component — no name collisions.
- **TypeScript (`.ts`/`.tsx`)**: JavaScript with type checking. Catches typos before the site goes live.
- **JSX/TSX**: the syntax mixing HTML-like tags with JavaScript in component files.
- **API Route**: a backend endpoint, defined in `src/app/api/*/route.ts`. Forms POST to these.
- **Middleware (`proxy.ts`)**: code that runs before every request — used here to guard `/admin`.
- **Environment variable**: a secret/setting kept outside the code (in `.env.local` or Vercel settings).
- **CMS**: Content Management System. Your admin panel at `/admin`.
- **Slug**: the URL-safe part of a page name. `master-chess-in-21-months` is the slug of `/blogs/master-chess-in-21-months`.
- **Cache / revalidate**: the site temporarily remembers DB data to be fast. `revalidate: 300` = forget after 5 min.
- **Schema.org / JSON-LD**: invisible structured data telling Google specifics about your business.
- **Razorpay**: Indian payment gateway. Your enrollment payments go through them.
- **EmailJS**: a third-party service that sends emails on behalf of a static site.
- **JWT**: a signed token. Your admin session is a JWT in a cookie.
- **Vercel**: where the site is hosted. Auto-deploys on git push.
- **CSP (Content Security Policy)**: a security header telling the browser what's allowed to load.

---

## QUICK REFERENCE CARD

| I want to… | Go to |
|---|---|
| Change a price | Admin → Courses |
| Add a coach | Admin → Coaches |
| Write a blog post | Admin → Blog Posts → New |
| Update the headline | Admin → Hero Settings |
| Add a testimonial | Admin → Testimonials |
| Change phone/email everywhere | Admin → Contact Info |
| Change a menu item | `src/components/Navbar.tsx` |
| Change brand colors | `src/app/globals.css` (top of file) |
| Change page title in browser tab | the page's `metadata` block, or `src/app/layout.tsx` for the default |
| Add a new page | new folder under `src/app/` with a `page.tsx` |
| Edit privacy policy | `src/app/privacy-policy/page.tsx` |
| Edit T&C | `src/app/terms/page.tsx` |
| Replace logo | drop `chaturangveda_logo.png` into `public/` |
| Update admin password | `ADMIN_PASSWORD` in `.env.local` + Vercel env |
| See server logs | Vercel dashboard → Functions |
| Roll back a bad deploy | Vercel → Deployments → previous green build → "Promote to Production" |

---

**When in doubt**: make the smallest change you can, test it locally with `npm run dev`, and only push when the local preview looks right. Git is forgiving — you can always revert.
