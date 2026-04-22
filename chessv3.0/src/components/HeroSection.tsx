"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HeroSection.module.css";

const rotatingPhrases = [
  "Strategic Thinking",
  "Grandmaster Curriculum",
  "FIDE-Rated Coaches",
  "Tournament Champions",
  "Critical Thinkers",
  "Future Leaders",
];

const stats = [
  { value: "2000+", label: "Students Trained" },
  { value: "10+", label: "Years Experience" },
  { value: "10", label: "FIDE-Rated Coaches" },
  { value: "150+", label: "Tournament Wins" },
];

const countries = [
  { code: "in", name: "India" },
  { code: "us", name: "USA" },
  { code: "gb", name: "UK" },
  { code: "ca", name: "Canada" },
  { code: "ae", name: "UAE" },
  { code: "sg", name: "Singapore" },
  { code: "au", name: "Australia" },
  { code: "nz", name: "New Zealand" },
  { code: "nl", name: "Netherlands" },
];

const FALLBACK_ACHIEVEMENTS = [
  {
    name: "Srinika",
    achievement: "National School Games Silver",
    detail: "U11 National Silver · Karnataka",
    image: "/images/achievements/national_winner_silver.png",
    badge: "🥈 National",
  },
  {
    name: "Samanvith",
    achievement: "State Championship Winner",
    detail: "Youngest champion · Age 8",
    image: "/images/2025/01/Samanvith-e1738320920340.png",
    badge: "🏆 State",
  },
  {
    name: "Ekaansh Sharma",
    achievement: "Telangana State Under-9",
    detail: "Top 3 finish · 8 months training",
    image: "/images/2025/01/Ekaansh-Sharma-e1738320995620.png",
    badge: "🥇 Top 3",
  },
  {
    name: "Anish",
    achievement: "District Level Gold",
    detail: "Rapid improvement · 6 months",
    image: "/images/2025/01/ANISH-e1738320951137.png",
    badge: "🥇 District",
  },
];

/* Per-champion enrichment: overline, reel tag, quote, 4 stats */
const CHAMP_ENRICHMENT = [
  {
    overline: "Our biggest achievement —",
    reelTag: "NATIONAL",
    quote: "Chess taught me to think three moves ahead — in school, in life, everywhere.",
    reelStats: [
      { n: "150+", l: "Total Wins" },
      { n: "9+",   l: "Countries" },
      { n: "1642", l: "FIDE Rating" },
      { n: "U-11", l: "Age Group" },
    ],
  },
  {
    overline: "State champion at",
    reelTag: "GOLD",
    quote: "I want to be the youngest Grandmaster from my state — Coach says I'm on track.",
    reelStats: [
      { n: "42",    l: "Match Wins" },
      { n: "Age 8", l: "Youngest" },
      { n: "1510",  l: "Rating" },
      { n: "STATE", l: "Champion" },
    ],
  },
  {
    overline: "Rising from Telangana,",
    reelTag: "TOP 3",
    quote: "My coach says I play like I've been doing this for years.",
    reelStats: [
      { n: "Top 3", l: "Podium" },
      { n: "8 mo",  l: "Training" },
      { n: "U-9",   l: "Division" },
      { n: "980",   l: "Rating" },
    ],
  },
  {
    overline: "In just 6 months,",
    reelTag: "GOLD",
    quote: "From beginner to gold in six months. One coach. Thousands of hours.",
    reelStats: [
      { n: "GOLD",   l: "District" },
      { n: "6 mo",   l: "Arc" },
      { n: "Age 10", l: "Year" },
      { n: "1220",   l: "Rating" },
    ],
  },
];

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
  const studentAchievements = achievements ?? FALLBACK_ACHIEVEMENTS;
  const featuredAchievement = keyAchievement ?? studentAchievements[0];
  const otherAchievements = studentAchievements.filter(
    (a) => a.name !== featuredAchievement.name
  );
  const activePhrases = heroSettings?.phrases ?? rotatingPhrases;
  const activeStats   = heroSettings?.stats   ?? stats;
  const headline1     = heroSettings?.headline1 ?? "Master Chess.";
  const headline2     = heroSettings?.headline2 ?? "Master Life.";
  const description   = heroSettings?.description ??
    "Expert chess coaching for kids by FIDE-rated coaches. From your child\u2019s first move to tournament glory \u2014 online classes for students across India, USA, UK, Australia, UAE, Netherlands and beyond.";

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % activePhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [activePhrases.length]);

  /* ── Champion Reel state ── */
  const allChamps = [featuredAchievement, ...otherAchievements].slice(0, 4);
  const champData = allChamps.map((ach, i) => {
    const enrich = CHAMP_ENRICHMENT[i] ?? CHAMP_ENRICHMENT[0];
    return {
      ...ach,
      initials: ach.name.slice(0, 2).toUpperCase(),
      overline: enrich.overline,
      reelTag: enrich.reelTag,
      quote: enrich.quote,
      reelStats: enrich.reelStats,
    };
  });

  const [champIdx, setChampIdx] = useState(0);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((n: number) => {
    setChampIdx(n);
  }, []);

  const restartLoop = useCallback(() => {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = setInterval(() => {
      setChampIdx((prev) => (prev + 1) % champData.length);
    }, 5000);
  }, [champData.length]);

  useEffect(() => {
    restartLoop();
    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, [restartLoop]);

  const champ = champData[champIdx];

  /* Ticker items: all achievements looped */
  const tickerAchs = [...studentAchievements, ...studentAchievements];

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroBgOrb1} />
      <div className={styles.heroBgOrb2} />
      <div className={styles.heroBgOrb3} />

      <div className={styles.floatingPieces}>
        <span className={`${styles.floatingPiece} ${styles.piece1}`}>♔</span>
        <span className={`${styles.floatingPiece} ${styles.piece2}`}>♕</span>
        <span className={`${styles.floatingPiece} ${styles.piece3}`}>♗</span>
        <span className={`${styles.floatingPiece} ${styles.piece4}`}>♘</span>
        <span className={`${styles.floatingPiece} ${styles.piece5}`}>♖</span>
        <span className={`${styles.floatingPiece} ${styles.piece6}`}>♙</span>
        <span className={`${styles.floatingPiece} ${styles.piece7}`}>♚</span>
        <span className={`${styles.floatingPiece} ${styles.piece8}`}>♞</span>
        <span className={`${styles.floatingPiece} ${styles.piece9}`}>♜</span>
        <span className={`${styles.floatingPiece} ${styles.piece10}`}>♛</span>
        <span className={`${styles.floatingPiece} ${styles.piece11}`}>♟</span>
        <span className={`${styles.floatingPiece} ${styles.piece12}`}>♝</span>
        <span className={`${styles.floatingPiece} ${styles.piece13}`}>♔</span>
        <span className={`${styles.floatingPiece} ${styles.piece14}`}>♞</span>
        <span className={`${styles.floatingPiece} ${styles.piece15}`}>♕</span>
        <span className={`${styles.floatingPiece} ${styles.piece16}`}>♜</span>
        <span className={`${styles.floatingPiece} ${styles.piece17}`}>♗</span>
        <span className={`${styles.floatingPiece} ${styles.piece18}`}>♙</span>
      </div>

      <div className={styles.chessGrid}>
        {Array.from({ length: 64 }).map((_, i) => (
          <motion.div
            key={i}
            className={`${styles.gridSquare} ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? styles.light : styles.dark}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.015, duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className={styles.particles}>
        {[
          { l: 10, t: 15, d: 0, dur: 4, s: 3 },
          { l: 25, t: 45, d: 1, dur: 5, s: 2 },
          { l: 40, t: 20, d: 2, dur: 6, s: 4 },
          { l: 55, t: 70, d: 0.5, dur: 4.5, s: 3 },
          { l: 70, t: 35, d: 1.5, dur: 5.5, s: 2.5 },
          { l: 85, t: 60, d: 3, dur: 4, s: 3.5 },
          { l: 15, t: 80, d: 2.5, dur: 6.5, s: 2 },
          { l: 60, t: 10, d: 4, dur: 5, s: 4 },
          { l: 35, t: 55, d: 1.2, dur: 4.8, s: 3 },
          { l: 80, t: 85, d: 3.5, dur: 5.2, s: 2.5 },
          { l: 5, t: 50, d: 0.8, dur: 6, s: 3 },
          { l: 45, t: 90, d: 2.2, dur: 4.2, s: 2 },
          { l: 90, t: 25, d: 4.5, dur: 5.8, s: 3.5 },
          { l: 20, t: 65, d: 1.8, dur: 4.5, s: 4 },
          { l: 75, t: 50, d: 3.2, dur: 6.2, s: 2 },
        ].map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              left: `${p.l}%`,
              top: `${p.t}%`,
              animationDelay: `${p.d}s`,
              animationDuration: `${p.dur}s`,
              width: `${p.s}px`,
              height: `${p.s}px`,
            }}
          />
        ))}
      </div>

      <div className={styles.heroLayout}>
        {/* ── LEFT: Headline + CTAs + Stats ── */}
        <div className={styles.heroContent}>
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          >
            <span className={styles.badgeDot} />
            Free Trial Available
          </motion.div>

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

          <div className={styles.rotatingTextContainer}>
            <span className={styles.rotatingLabel}>We Build → </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                className={styles.rotatingWord}
                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {activePhrases[phraseIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            {description}
          </motion.p>

          <motion.div
            className={styles.heroCTAs}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            <motion.a
              href="/book-free-trial"
              className="btn-primary"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(21,101,192,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              Book Free Trial →
            </motion.a>
            <motion.a
              href="https://wa.me/+917569194709"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Chat on WhatsApp
            </motion.a>
          </motion.div>

          <motion.div
            className={styles.heroStats}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            {activeStats.map((stat, i) => (
              <div key={i} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{stat.value}</span>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Champion Reel V6 ── */}
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── V6 Champion Reel Card ── */}
          <div className={styles.v6Stage}>

            {/* ── LEFT panel: navy blue portrait ── */}
            <div className={styles.v6Left}>
              {/* chess grid is ::before pseudo on v6Left — no div needed */}

              {/* top label */}
              <div className={styles.v6Label}>
                <span className={styles.v6Bar} />
                <span>2025 SEASON · REEL {String(champIdx + 1).padStart(2, "0")}/{String(champData.length).padStart(2, "0")}</span>
              </div>

              {/* portrait */}
              <div className={styles.v6Portrait}>
                {/* stripe SVG background */}
                <svg className={styles.v6PortraitBg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="reel-stripe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                      <rect width="10" height="10" fill="#dfe8f7" />
                      <rect width="3.5" height="10" fill="#c6d5ee" />
                    </pattern>
                    <radialGradient id="reel-grad" cx="50%" cy="45%" r="70%">
                      <stop offset="0%" stopColor="#eef4ff" />
                      <stop offset="100%" stopColor="#c6d5ee" />
                    </radialGradient>
                  </defs>
                  <rect width="100" height="100" fill="url(#reel-grad)" />
                  <rect width="100" height="100" fill="url(#reel-stripe)" opacity="0.7" />
                </svg>

                {/* photo or initials — dark overlay + shimmer sweep are ::after/::before pseudos */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={champIdx + "-portrait"}
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {champ.image ? (
                      <Image
                        src={champ.image}
                        alt={champ.name}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center top" }}
                        sizes="300px"
                      />
                    ) : (
                      <>
                        <span className={styles.v6Ini}>{champ.initials}</span>
                        <span className={styles.v6Note}>PHOTO PLACEHOLDER</span>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* medal bar */}
                <div className={styles.v6MedalBar}>
                  <div className={styles.v6MedalCircle}>
                    {champIdx === 0 ? "I" : champIdx === 1 ? "II" : champIdx === 2 ? "III" : "IV"}
                  </div>
                  <div className={styles.v6MedalText}>
                    {champ.achievement}
                    <small>{champ.detail}</small>
                  </div>
                  <div className={styles.v6Live}>Live</div>
                </div>
              </div>

              {/* quote */}
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={champIdx + "-quote"}
                  className={styles.v6Quote}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  &ldquo;{champ.quote}&rdquo;
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* ── RIGHT panel: white editorial ── */}
            <div className={styles.v6Right}>
              <div>
                {/* issue header */}
                <div className={styles.v6Issue}>
                  <span>VOL. 10 · ISSUE {String(champIdx + 1).padStart(2, "0")}</span>
                  <span className={styles.v6Key}>KEY ACHIEVEMENT</span>
                </div>

                {/* name block */}
                <div className={styles.v6NameBlock}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={champIdx + "-overline"}
                      className={styles.v6Overline}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {champ.overline}
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={champIdx + "-name"}
                      className={styles.v6Name}
                      initial={{ y: 24, opacity: 0, skewY: -3 }}
                      animate={{ y: 0, opacity: 1, skewY: 0 }}
                      exit={{ y: -20, opacity: 0, skewY: 3 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.1] }}
                    >
                      {champ.name}
                      <span className={styles.v6NameDot}>.</span>
                    </motion.h2>
                  </AnimatePresence>
                </div>

                {/* achievement line */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={champIdx + "-ach"}
                    className={styles.v6AchLine}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.v6Award}>
                      <span className={styles.v6Tag}>{champ.reelTag}</span>
                      {champ.achievement}
                    </div>
                    <div className={styles.v6Sub}>{champ.detail}</div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div>
                {/* 4-stat grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={champIdx + "-stats"}
                    className={styles.v6StatGrid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {champ.reelStats.map((s) => (
                      <div key={s.l} className={styles.v6StatCell}>
                        <div className={styles.v6StatNum}>{s.n}</div>
                        <div className={styles.v6StatLbl}>{s.l}</div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* footer: CTA + nav dots */}
                <div className={styles.v6Foot}>
                  <Link href="/blogs" className={styles.v6Cta}>
                    Read full story →
                  </Link>
                  <div className={styles.v6DotsRow}>
                    {champData.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.v6NavDot} ${i === champIdx ? styles.v6NavDotOn : ""}`}
                        onClick={() => { goTo(i); restartLoop(); }}
                        aria-label={`Champion ${i + 1}`}
                      />
                    ))}
                    <span className={styles.v6DotCount}>
                      {String(champIdx + 1).padStart(2, "0")} / {String(champData.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── More Achievements ticker ── */}
          <div className={styles.moreHead}>
            <span className={styles.moreTitle}>More Achievements</span>
            <Link href="/blogs" className={styles.moreLink}>View all →</Link>
          </div>
          <div className={styles.ticker}>
            <div className={styles.tickerTrack}>
              {tickerAchs.map((a, i) => (
                <div key={i} className={styles.mini}>
                  <div className={styles.miniAva}>{a.name.slice(0, 2).toUpperCase()}</div>
                  <div className={styles.miniInfo}>
                    <div className={styles.miniName}>{a.name}</div>
                    <div className={styles.miniAch}>
                      {a.achievement} · <span className={styles.miniTag}>{a.badge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Country flags */}
          <div className={styles.flagsRow}>
            {countries.map((c) => (
              <span key={c.name} className={styles.flagChip}>
                <img
                  src={`https://flagcdn.com/w20/${c.code}.png`}
                  alt={c.name}
                  width={16}
                  height={12}
                  className={styles.flagImg}
                />
                {c.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className={styles.scrollMouse} />
        <span>SCROLL</span>
      </motion.div>
    </section>
  );
}
