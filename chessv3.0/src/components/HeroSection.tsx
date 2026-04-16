"use client";

import { useEffect, useState } from "react";
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
    detail: "Youngest champion · Age 9",
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
  const activePhrasess = heroSettings?.phrases ?? rotatingPhrases;
  const activeStats   = heroSettings?.stats   ?? stats;
  const headline1     = heroSettings?.headline1 ?? 'Master Chess.';
  const headline2     = heroSettings?.headline2 ?? 'Master Life.';
  const description   = heroSettings?.description ??
    "Expert chess coaching for kids by FIDE-rated coaches. From your child\u2019s first move to tournament glory \u2014 online classes for students across India, USA, UK, Australia, UAE, Netherlands and beyond.";
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % activePhrasess.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [activePhrasess.length]);

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
                {activePhrasess[phraseIndex]}
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
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 30px rgba(21,101,192,0.4)",
              }}
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

        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
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

          {/* Stats strip */}
          <div className={styles.statsStrip}>
            {[
              { val: "150+", label: "Tournament Wins" },
              { val: "2000+", label: "Students" },
              { val: "10", label: "Coaches" },
              { val: "9+", label: "Countries" },
            ].map((s, i, arr) => (
              <div key={s.label} className={styles.stripItem}>
                <span className={styles.stripVal}>{s.val}</span>
                <span className={styles.stripLabel}>{s.label}</span>
                {i < arr.length - 1 && <div className={styles.stripDivider} />}
              </div>
            ))}
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
