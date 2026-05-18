import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { getContent } from "@/lib/content";

export const metadata = {
  title: "World-Class Chess Coaches | Chaturangveda",
  description:
    "Meet our FIDE-rated chess coaches — decade-long experience, national and international players who teach, inspire, and build champions.",
};

const coaches = [
  {
    name: "Manoj Reddy Maram",
    title: "Head Coach & Founder",
    experience: "10+ Years",
    badge: "FIDE Rated",
    image: "/images/2025/02/ManojReddyMaram.jpg",
    objectPosition: "center 30%",
    bio: "A FIDE-rated international player who has dedicated over a decade to mastering and teaching chess. With 100+ students trained from beginner to tournament level, Manoj brings deep expertise in opening theory, endgame mastery, and psychological preparation.",
    specialties: [
      "Opening Theory",
      "Endgame Mastery",
      "Tournament Prep",
      "Tactics",
    ],
    achievements: [
      "FIDE-Rated International Player",
      "Trained 100+ students",
      "10+ years of coaching",
    ],
  },
  {
    name: "Uttham Naresh Patti",
    title: "Senior Coach",
    experience: "10+ Years",
    badge: "National Level",
    image: "/images/2025/02/1697257716831.jpg",
    objectPosition: "center 1%",
    bio: "A two-time national-level player with 5+ years of dedicated coaching experience. Uttham specialises in tactical play and building the competitive mindset required to succeed at tournaments.",
    specialties: [
      "Tactical Play",
      "Middlegame Strategy",
      "National Prep",
      "Youth Coaching",
    ],
    achievements: [
      "Two-time National-Level Player",
      "5+ years coaching",
      "Tournament preparation specialist",
    ],
  },
  {
    name: "Rajdip",
    title: "Coach",
    experience: "5+ Years",
    badge: "State Level",
    image: "/images/2025/02/resume.png",
    objectPosition: "center center",
    bio: "Brings an energetic and accessible approach to chess coaching, having trained 30+ students to impressive state-level results. Known for making complex ideas fun — Rajdip has a special talent for engaging young learners.",
    specialties: [
      "Beginner Curriculum",
      "State-Level Prep",
      "Fun Learning",
      "Youth Development",
    ],
    achievements: [
      "Trained 30+ students",
      "State-level wins",
      "Youth coaching specialist",
    ],
  },
  {
    name: "Subham Prasad",
    title: "Coach",
    experience: "3+ Years",
    badge: "Arena FIDE Master",
    image: "/images/2025/shubham.jpg",
    objectPosition: "center 30%",
    bio: "An Arena FIDE Master (AFM) title holder from the World Chess Federation, with a track record of podium finishes at international and national tournaments. Subham brings a structured, competition-focused coaching style to students aiming for rated play.",
    specialties: [
      "Tournament Preparation",
      "Tactical Patterns",
      "Opening Systems",
      "Rated Play",
    ],
    achievements: [
      "Arena FIDE Master — World Chess Federation",
      "2nd prize, Delhi GM International (Below 1500), 2025",
      "1st prize, 1st Assam University International, Silchar, 2025",
      "District Runners-Up, Jalpaiguri Open, 2026",
      "7th prize, State U15, 2018",
      "Scored 5/6 on Board 4, National Cities Team",
    ],
  },
];

const FALLBACK_COACHES = coaches;

const ACHIEVEMENTS_BY_ID: Record<string, string[]> = {
  'manoj-reddy-maram':   coaches[0].achievements,
  'uttham-naresh-patti': coaches[1].achievements,
  'rajdip':              coaches[2].achievements,
  'subham-prasad':       coaches[3].achievements,
};

export default async function CoachesPage() {
  const cmsCoaches = await getContent<Array<{
    id: string; name: string; title: string; fideRating: string;
    experience: string; specialties: string; bio: string; photo: string; photoFocus: string;
  }>>('coaches', []);

  const displayCoaches = cmsCoaches.length > 0
    ? cmsCoaches.map((c) => ({
        name: c.name,
        title: c.title,
        experience: c.experience,
        badge: c.fideRating ? `FIDE ${c.fideRating}` : c.title,
        image: c.photo,
        objectPosition: c.photoFocus ?? 'center center',
        bio: c.bio,
        specialties: c.specialties ? c.specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        achievements: ACHIEVEMENTS_BY_ID[c.id] ?? [],
      }))
    : FALLBACK_COACHES;

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>The Team</div>
        <h1 className={styles.heroTitle}>World-Class Chess Coaches</h1>
        <p className={styles.heroSub}>
          Decades of combined experience, FIDE ratings, and a genuine passion
          for teaching.
        </p>
      </section>

      <div className={styles.coachesSection}>
        {displayCoaches.map((coach) => (
          <div key={coach.name} className={styles.coachCard}>
            <div className={styles.coachImageWrap}>
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: coach.objectPosition,
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1100px) 240px, 320px"
              />
              <span className={styles.coachBadge}>{coach.badge}</span>
            </div>
            <div className={styles.coachInfo}>
              <h2 className={styles.coachName}>{coach.name}</h2>
              <div className={styles.coachTitle}>{coach.title}</div>
              <div className={styles.coachExp}>
                {coach.experience} experience
              </div>
              <p className={styles.coachBio}>{coach.bio}</p>

              <div className={styles.specialtiesLabel}>Specialties</div>
              <div className={styles.specialties}>
                {coach.specialties.map((s) => (
                  <span key={s} className={styles.specialty}>
                    {s}
                  </span>
                ))}
              </div>

              <div className={styles.achievementsLabel}>Achievements</div>
              <ul className={styles.achievements}>
                {coach.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.joinCta}>
        <div className={styles.joinCtaInner}>
          <h2 className={styles.joinCtaTitle}>Are You a Chess Expert?</h2>
          <p className={styles.joinCtaSub}>
            We&apos;re always looking for passionate coaches to join our growing
            team.
          </p>
          <Link href="/become-a-coach" className="btn-primary">
            Become a Coach
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
