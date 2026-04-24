/**
 * Seeds site_content from the actual hardcoded data in page components.
 * Run: npx tsx src/scripts/seed-site-content.ts
 */

import mysql from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const envLocalPath = join(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
  for (const line of readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
}

const pool = mysql.createPool({ uri: process.env.DB_CONN!, waitForConnections: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsert(key: string, value: any) {
  await pool.query(
    `INSERT INTO site_content (\`key\`, value, updated_at)
     VALUES (?, ?, NOW())
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
  console.log(`  ✓ ${key}`);
}

async function seed() {
  console.log('Seeding site_content from live page data…\n');

  // ── coaches — from coaches/page.tsx hardcoded array (4 coaches) ──
  await upsert('coaches', [
    {
      id: 'manoj-reddy-maram',
      name: 'Manoj Reddy Maram',
      title: 'Head Coach & Founder',
      fideRating: 'Rated',
      experience: '10+ Years',
      specialties: 'Opening Theory, Endgame Mastery, Tournament Prep, Tactics',
      bio: 'A FIDE-rated international player who has dedicated over a decade to mastering and teaching chess. With 100+ students trained from beginner to tournament level, Manoj brings deep expertise in opening theory, endgame mastery, and psychological preparation.',
      photo: '/images/2025/02/ManojReddyMaram.jpg',
      photoFocus: 'center 30%',
    },
    {
      id: 'uttham-naresh-patti',
      name: 'Uttham Naresh Patti',
      title: 'Senior Coach',
      fideRating: '',
      experience: '10+ Years',
      specialties: 'Tactical Play, Middlegame Strategy, National Prep, Youth Coaching',
      bio: 'A two-time national-level player with 5+ years of dedicated coaching experience. Uttham specialises in tactical play and building the competitive mindset required to succeed at tournaments.',
      photo: '/images/2025/02/1697257716831.jpg',
      photoFocus: 'center 1%',
    },
    {
      id: 'rajdip',
      name: 'Rajdip',
      title: 'Coach',
      fideRating: '',
      experience: '5+ Years',
      specialties: 'Beginner Curriculum, State-Level Prep, Fun Learning, Youth Development',
      bio: 'Brings an energetic and accessible approach to chess coaching, having trained 30+ students to impressive state-level results. Known for making complex ideas fun — Rajdip has a special talent for engaging young learners.',
      photo: '/images/2025/02/resume.png',
      photoFocus: 'center center',
    },
    {
      id: 'subham-prasad',
      name: 'Subham Prasad',
      title: 'Coach',
      fideRating: 'Arena FIDE Master',
      experience: '3+ Years',
      specialties: 'Tournament Preparation, Tactical Patterns, Opening Systems, Rated Play',
      bio: 'An Arena FIDE Master (AFM) title holder from the World Chess Federation, with a track record of podium finishes at international and national tournaments. Subham brings a structured, competition-focused coaching style to students aiming for rated play.',
      photo: '/images/2025/shubham.jpg',
      photoFocus: 'center 30%',
    },
  ]);

  // ── curriculum — from curriculum/page.tsx hardcoded levels (5 levels) ──
  await upsert('curriculum', [
    {
      id: 'foundation',
      level: 'Foundation — 8×8 Beginner',
      description: '3 Months · Goal: Play a complete game confidently, understand the board, and enter your first school or club tournament.',
      modules: [
        '- Rules & how all pieces move',
        '- Attack, defence & piece value',
        '- Check, checkmate & stalemate',
        '- Basic checkmates (K+Q, K+R)',
        '- Opening principles & pawn structure',
      ].join('\n'),
    },
    {
      id: 'level-1',
      level: 'Level 1 — 8×8 Elementary',
      description: '3 Months · Goal: Compete confidently in school and club-level tournaments and start building a personal opening repertoire.',
      modules: [
        '- Piece coordination & exchanges',
        '- Tactical patterns: forks, pins, skewers',
        '- Simple pawn endgames',
        '- Intro to opening theory',
        '- Tournament rules & etiquette',
      ].join('\n'),
    },
    {
      id: 'level-2',
      level: 'Level 2 — 8×8 Intermediate',
      description: '4 Months · Goal: Win district & state-level tournaments, analyse your own games, and consistently play accurate middlegames.',
      modules: [
        '- Opening theory (common systems)',
        '- Tactical motifs: discovered attacks, zwischenzug',
        '- Basic endgame theory',
        '- Middlegame strategy & planning',
        '- Game analysis & self-review',
      ].join('\n'),
    },
    {
      id: 'level-3',
      level: 'Level 3 — 8×8 Advanced',
      description: '5 Months · Goal: Compete at national level, achieve strong performance in rated events, and work concretely towards earning your FIDE rating.',
      modules: [
        '- Advanced tactical combinations (3–5 moves)',
        '- Piece activity & coordination',
        '- Advanced attacking patterns',
        '- Full endgame theory (rook, minor piece)',
        '- Positional play & pawn structures',
      ].join('\n'),
    },
    {
      id: 'level-4',
      level: 'Level 4 — 8×8 Expert / FIDE Prep',
      description: '6 Months · Goal: Ace international tournaments, earn your FIDE rating, and have the tools to continue improving independently.',
      modules: [
        '- Deep opening preparation & repertoire',
        '- Master-level endgame strategies',
        '- Advanced calculation & visualisation',
        '- International tournament preparation',
        '- Tournament psychology & clock management',
      ].join('\n'),
    },
  ]);

  // ── hero-settings — from home page DEFAULT_PHRASES + DEFAULT_HERO_STATS ──
  await upsert('hero-settings', {
    headline1: 'Master Chess.',
    headline2: 'Master Life.',
    description: "Expert chess coaching for kids by FIDE-rated coaches. From your child's first move to tournament glory — online classes for students across India, USA, UK, Australia, UAE, Netherlands and beyond.",
    phrases: [
      'Strategic Thinking',
      'Grandmaster Curriculum',
      'FIDE-Rated Coaches',
      'Tournament Champions',
      'Critical Thinkers',
      'Future Leaders',
    ],
    stats: [
      { id: 'students', value: '2000+', label: 'Students Trained' },
      { id: 'experience', value: '10+', label: 'Years Experience' },
      { id: 'coaches', value: '10', label: 'FIDE-Rated Coaches' },
      { id: 'wins', value: '150+', label: 'Tournament Wins' },
    ],
  });

  // ── stats ──
  await upsert('stats', [
    { id: 'students', number: '2000+', label: 'Students Trained' },
    { id: 'experience', number: '10+', label: 'Years Experience' },
    { id: 'coaches', number: '10', label: 'FIDE-Rated Coaches' },
    { id: 'wins', number: '150+', label: 'Tournament Wins' },
  ]);

  // ── achievements — from the blog post + known student results ──
  await upsert('achievements', [
    {
      id: 'srinika-national-silver-2026',
      name: 'Srinika',
      achievement: 'Silver Medal',
      event: '69th National School Games — U11',
      year: '2026',
      photo: '/images/achievements/national_winner_silver.png',
      photoFocus: 'center center',
      badge: 'silver',
      isKey: true,
    },
    {
      id: 'ekaansh-state-u9-2025',
      name: 'Ekaansh Sharma',
      achievement: 'Top 3',
      event: 'Telangana State Under-9 Championship',
      year: '2025',
      photo: '/images/2025/01/Ekaansh-Sharma-e1738320995620.png',
      photoFocus: 'center center',
      badge: 'gold',
      isKey: false,
    },
    {
      id: 'samanvith-state-champion-2024',
      name: 'Samanvith',
      achievement: 'State Champion',
      event: 'State Championship',
      year: '2024',
      photo: '/images/2025/01/Samanvith-e1738320920340.png',
      photoFocus: 'center center',
      badge: 'gold',
      isKey: false,
    },
  ]);

  // ── contact — from site-data.json ──
  await upsert('contact', {
    phone: '+91 75691 94709',
    whatsapp: 'https://wa.me/+917569194709',
    email: '',
    location: 'Hyderabad, India',
    hours: 'Mon–Sat, 9am–8pm IST',
  });

  // ── testimonials — empty, add via admin panel ──
  await upsert('testimonials', []);

  // ── courses — from services/page.tsx programs ──
  await upsert('courses', [
    {
      id: 'free-trial',
      title: 'Free Trial Class',
      price: 'Free',
      features: ['Full 45-minute session', 'FIDE-rated coach assessment', 'Personalised feedback report', 'Instant WhatsApp confirmation'],
      cta: 'Book Free Trial',
      highlighted: false,
    },
    {
      id: 'group-classes',
      title: 'Group Chess Classes',
      price: '',
      features: ['Maximum 5 students per batch', '2–3 sessions per week', 'Opening theory & tactical puzzles', 'Peer games and live analysis', 'Monthly progress review'],
      cta: 'Enroll Now',
      highlighted: true,
    },
    {
      id: 'private-1on1',
      title: 'Private 1-on-1 Classes',
      price: '',
      features: ['100% 1-on-1 with expert coach', 'Completely custom curriculum', 'Flexible scheduling', 'Tournament preparation', 'Deep grandmaster game analysis'],
      cta: 'Enroll Now',
      highlighted: false,
    },
  ]);

  console.log('\nDone. All content seeded from live page data.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
