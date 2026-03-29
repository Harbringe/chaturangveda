import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

type Params = { params: Promise<{ slug: string }> };

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  imagePosition?: string;
  content: React.ReactNode;
};

const posts: BlogPost[] = [
  {
    slug: 'ekaansh-sharma-rising-star',
    title: 'Ekaansh Sharma: A Rising Star in the World of Chess',
    date: 'February 27, 2025',
    readTime: '5 min read',
    category: 'Student Stories',
    image: '/images/2025/01/Ekaansh-Sharma-e1738320995620.png',
    imagePosition: 'top',
    content: (
      <>
        <p>Ekaansh Sharma joined Chaturangveda at age 7 with no prior chess experience. In less than a year, he had competed — and won — at the state level.</p>
        <p>What makes Ekaansh&apos;s journey remarkable isn&apos;t just the trophies. It&apos;s the transformation. His parents describe a child who struggled with focus in school, but who sat completely still, eyes locked on the board, the moment a chess session began.</p>
        <p>&quot;Chess gave him a reason to think slowly,&quot; said his mother. &quot;He used to rush through everything. Now he plans.&quot;</p>
        <h2>From the First Move to the Tournament Stage</h2>
        <p>Ekaansh started with our Beginner curriculum, learning the rules, piece movements, and basic tactics. Within three months, he had moved to the Intermediate level — unusually fast progress that caught the attention of his coach, Manoj Reddy Maram.</p>
        <p>&quot;He had an intuitive feel for the board that I rarely see in beginners,&quot; Manoj recalls. &quot;He was thinking ahead naturally. We just had to give that instinct structure.&quot;</p>
        <p>By month six, Ekaansh was studying real grandmaster games and preparing for his first tournament.</p>
        <h2>Tournament Day</h2>
        <p>Ekaansh competed in the Telangana State Under-9 Championship in early 2025. He finished in the top three — a stunning result for someone who had started from scratch less than a year earlier.</p>
        <p>&quot;I was nervous before every game,&quot; Ekaansh admitted. &quot;But then I sat down and it felt like normal practice. Just me and the board.&quot;</p>
        <h2>What&apos;s Next</h2>
        <p>Ekaansh is now training for national-level competitions. His goal: an international FIDE rating by the time he turns 10.</p>
        <p>Stories like his are exactly why Chaturangveda exists — to show that with the right coaching, every child has untapped potential waiting to be unlocked.</p>
      </>
    ),
  },
  {
    slug: 'benefits-of-chess-for-kids',
    title: 'Why Chess is the Best Brain Training for Kids',
    date: 'January 15, 2025',
    readTime: '4 min read',
    category: 'Education',
    image: '/images/2024/08/young-kid-playing-chess.webp',
    content: (
      <>
        <p>Chess has been played for over 1,500 years, but only in recent decades have scientists begun to fully understand why it is one of the most powerful cognitive tools ever devised. For children, learning chess doesn&apos;t just teach a game — it rewires the brain.</p>
        <p>Research consistently shows that children who play chess demonstrate measurable improvements in mathematics, reading comprehension, and problem-solving. A landmark study of 4,000 students found that chess players improved their math test scores by 17.3% compared to non-players in the same period. But the benefits go far deeper than grades.</p>
        <h2>Critical Thinking and Planning</h2>
        <p>Every chess move requires a child to evaluate multiple possibilities, anticipate consequences, and commit to a plan under uncertainty. This is precisely the kind of thinking that educators call &quot;executive function&quot; — and it is the same skill set that predicts academic success, career achievement, and even emotional resilience in adulthood.</p>
        <p>When a child asks &quot;if I move here, what happens next?&quot;, they are practising multi-step reasoning. Do this three times a week for a year, and the habit becomes automatic — they start doing it in classrooms, in social situations, and eventually in every major decision they face.</p>
        <h2>Concentration and Focus</h2>
        <p>In an era of smartphones and instant gratification, concentration is increasingly rare — and increasingly valuable. A chess game demands sustained, deep focus for 30 to 90 minutes at a time. Children who practise this regularly develop an attention span that stands out in every setting.</p>
        <p>Parents at Chaturangveda frequently report that their children&apos;s teachers noticed improved focus in class — not just in chess sessions. The game trains the brain to stay present, resist distraction, and return to the task at hand.</p>
        <h2>Emotional Intelligence and Resilience</h2>
        <p>Chess teaches children to lose gracefully. Every player — even grandmasters — loses games regularly. Learning to analyse a defeat without despair, to find lessons in failure, and to come back to the board with fresh energy is one of the most valuable life skills chess provides.</p>
        <p>Equally, winning graciously — acknowledging an opponent&apos;s good moves, shaking hands, and not gloating — teaches the sportsmanship that forms the foundation of character.</p>
        <h2>The Chaturangveda Approach</h2>
        <p>At Chaturangveda, we don&apos;t just teach chess — we use chess to teach life skills. Every session is designed to build not just tactical ability, but the habits of mind that will serve your child for decades. Our FIDE-rated coaches understand that a child&apos;s first year of chess sets the pattern for everything that follows, which is why we take the beginner stage as seriously as tournament preparation.</p>
        <p>The best time to start is now. The second best time is tomorrow.</p>
      </>
    ),
  },
  {
    slug: 'tournament-preparation-guide',
    title: 'How We Prepare Students for Tournaments',
    date: 'December 10, 2024',
    readTime: '6 min read',
    category: 'Coaching',
    image: '/images/2025/01/winners.jpg',
    content: (
      <>
        <p>Behind every student who steps onto a tournament stage at Chaturangveda is months of careful, structured preparation. Tournaments are not just competitions — they are growth accelerators. The pressure, the unfamiliar opponents, the clock — all of it forces a player to find resources they didn&apos;t know they had.</p>
        <p>But walking in unprepared is a very different experience from walking in ready. Our coaches have developed a tournament preparation methodology that has produced consistent results at district, state, and national level.</p>
        <h2>Phase 1: Technical Foundation (Months 1–3)</h2>
        <p>No amount of psychological preparation can compensate for gaps in technical knowledge. In the first phase, we focus on ensuring the student has a solid opening repertoire — typically two or three reliable systems as White and reliable responses as Black. We don&apos;t try to build a complete repertoire; we build a trustworthy one.</p>
        <p>Alongside openings, we run intensive tactical puzzles — forks, pins, skewers, discovered attacks, back-rank mates. The goal is pattern recognition: the student should spot a winning tactic in under five seconds when it appears in a game. This comes only from repetition.</p>
        <h2>Phase 2: Game Analysis (Months 2–4)</h2>
        <p>We play through grandmaster games — not to memorise moves, but to absorb strategic ideas. How do top players handle isolated pawns? When do they sacrifice material for positional compensation? What does a dominant knight on d5 actually feel like to play against?</p>
        <p>We also analyse the student&apos;s own games extensively. Every blunder is a lesson. Every missed tactic is an opportunity. Our coaches use engine analysis not to find &quot;the best move&quot; but to find moments where the student&apos;s thinking process broke down — and to address that process directly.</p>
        <h2>Phase 3: Simulated Competition (Month Before the Tournament)</h2>
        <p>In the final phase, we run timed games against opponents of varied styles. A student preparing for a tournament should be comfortable playing against attacking players, positional players, and defensive players — each requires a different approach.</p>
        <p>We also practise clock management specifically. Time trouble is the single most common cause of unnecessary defeats at the youth level. Students learn to make decisions within defined time windows, and to trust their preparation when the clock is running low.</p>
        <h2>The Mental Side</h2>
        <p>Coach Manoj works with every tournament-bound student on what he calls &quot;the pre-game ritual&quot;: a sequence of simple mental steps taken before each game to get into the right state. Deep breathing, a brief review of key tactical themes, a reminder of the opening plan, and a resolution to focus on the process — not the result.</p>
        <p>&quot;The result takes care of itself when you play good chess,&quot; he tells every student. &quot;Your only job is to find the best move in front of you. Everything else is noise.&quot;</p>
        <h2>After the Tournament</h2>
        <p>Tournament preparation doesn&apos;t end when the event does. We conduct detailed post-tournament reviews for every student — analysing each game, identifying patterns, and setting new targets. The best learning often comes in the 48 hours after a tournament, when the games are fresh and the emotions have settled enough to think clearly.</p>
        <p>This cycle — prepare, compete, review, improve — is what separates students who plateau from students who keep getting better.</p>
      </>
    ),
  },
  {
    slug: 'samanvith-state-champion',
    title: 'Samanvith Wins State Championship — Our Youngest Champion Yet',
    date: 'November 5, 2024',
    readTime: '4 min read',
    category: 'Student Stories',
    image: '/images/2025/01/Samanvith-e1738320920340.png',
    imagePosition: 'top',
    content: (
      <>
        <p>When Samanvith walked into his first Chaturangveda session six months ago, he was nine years old, knew the basic rules, and had never played a competitive game. When he walked off the stage at the Telangana State Under-10 Championship, he was holding a trophy.</p>
        <p>His coach, Uttham Naresh Patti, saw the potential early. &quot;Samanvith has a fighter&apos;s instinct,&quot; Uttham says. &quot;He doesn&apos;t get scared when the position gets complicated. Most beginners try to simplify everything — he leans in.&quot;</p>
        <h2>The Six Months</h2>
        <p>Samanvith trained three times a week in Chaturangveda&apos;s Beginner batch before graduating to Intermediate after just eight weeks. His rapid progress wasn&apos;t just tactical — he developed an unusually mature understanding of piece activity and pawn structure for his age.</p>
        <p>By month four, Uttham began dedicated tournament preparation: opening repertoire, endgame essentials, and extensive tactical training. Samanvith worked on puzzles daily, reviewing 20–30 positions every morning before school.</p>
        <p>&quot;He was obsessed,&quot; his father admits with a laugh. &quot;He would show me chess problems at breakfast. I don&apos;t even play chess — but I learned the word &apos;fork&apos; very quickly.&quot;</p>
        <h2>Championship Day</h2>
        <p>The Telangana State Under-10 Championship drew 84 players from across the state. Samanvith won five of his seven games and drew one, finishing joint first on points and winning on tiebreaks.</p>
        <p>His most memorable game was the penultimate round against a rated player three years his senior. Down a pawn in an endgame, Samanvith converted a passed pawn sequence that drew applause from the watching coaches — a technique he had practised in training sessions just weeks earlier.</p>
        <p>&quot;I saw the pattern,&quot; he said afterwards, with the calm confidence of someone twice his age. &quot;We had done it in class.&quot;</p>
        <h2>What This Means</h2>
        <p>Samanvith is now our youngest state-level champion. He will represent Telangana at the national level later this year. But more than the title, what strikes everyone who works with him is his attitude: he is never satisfied with a draw, never rattled by a loss, and never stops asking questions.</p>
        <p>That curiosity — that relentless desire to understand — is what chess teaches at its best. Samanvith has it in abundance. We cannot wait to see what comes next.</p>
      </>
    ),
  },
  {
    slug: 'opening-principles-for-beginners',
    title: 'The 3 Golden Rules of Chess Openings Every Beginner Must Know',
    date: 'October 22, 2024',
    readTime: '5 min read',
    category: 'Tips & Tricks',
    image: '/images/2024/03/how-to-play-chess.webp',
    content: (
      <>
        <p>Before your child memorises a single opening line, before they learn the Ruy López or the Sicilian Defence, there are three principles that will make every opening they ever play stronger. These principles have been taught for centuries, and they work — not because chess masters say so, but because they follow directly from the logic of the game.</p>
        <h2>Rule 1: Control the Centre</h2>
        <p>The four central squares — e4, d4, e5, d5 — are the most important squares on the board. Pieces placed in or near the centre have more mobility, more attacking options, and more defensive coverage than pieces placed on the edge.</p>
        <p>A knight on e4 attacks eight squares. A knight on a1 attacks two. This is why the very first move of a chess game matters so much: moving a pawn to e4 or d4 immediately contests the centre and opens lines for your pieces to develop.</p>
        <p>Teach your child to ask before every opening move: &quot;Does this move help me control the centre, or does it ignore it?&quot;</p>
        <h2>Rule 2: Develop Your Pieces</h2>
        <p>Development means moving your pieces from their starting squares to active positions where they contribute to the game. A piece still on its starting square in move 10 is a wasted resource — like having a player sitting on the bench during a crucial match.</p>
        <p>The practical rules of development are simple: move each piece once before moving any piece twice. Don&apos;t move the same piece repeatedly in the opening unless there is a very good reason. Prioritise knights and bishops — they are your most mobile pieces in the early game and should be out by move 4 or 5.</p>
        <p>Rooks and the queen should generally wait until the board is more open and the position more defined.</p>
        <h2>Rule 3: Castle Early</h2>
        <p>Castling is the most important defensive move in chess. It simultaneously tucks your king away from the dangerous central files and connects your rooks. A king still sitting in the centre at move 15 is almost always in danger.</p>
        <p>The rule of thumb: castle within the first 10 moves. Both kingside and queenside castling are fine — the choice depends on where your pieces are developed. But do it early, and do it before launching any major attack.</p>
        <p>A useful exercise: have your child play ten games with one instruction only — castle by move 8. They will discover very quickly how much safer the king feels, and how much more confidently they can attack when the king is protected.</p>
        <h2>The One Principle Behind All Three</h2>
        <p>All three rules point to the same underlying idea: <em>use all your pieces.</em> Control the centre to give your pieces space. Develop your pieces to give them activity. Castle to connect your rooks and activate your last undeveloped major piece.</p>
        <p>Players who consistently apply these three principles in the opening will outperform opponents who know twice as many opening variations but ignore the fundamentals. At Chaturangveda, we build every student&apos;s opening repertoire on this foundation — and it shows in their results.</p>
      </>
    ),
  },
  {
    slug: 'group-vs-private-classes',
    title: 'Group Classes vs Private Coaching: Which Is Right For Your Child?',
    date: 'September 3, 2024',
    readTime: '3 min read',
    category: 'Coaching',
    image: '/images/2024/08/adorable-siblings-lying-ground-playing-chess-with-each-other.webp',
    content: (
      <>
        <p>One of the most common questions parents ask us is: should my child join a group batch or invest in private coaching? Both formats work — but they work best for different students, at different stages, and with different goals. Here is an honest breakdown.</p>
        <h2>The Case for Group Classes</h2>
        <p>Group classes — at Chaturangveda, never more than 5 students per batch — offer something private coaching cannot: the energy of peer learning. When a child watches another student spot a tactic they missed, or defends against a classmate&apos;s attack, they absorb lessons differently than they would in a one-on-one setting.</p>
        <p>Healthy competition among peers is a powerful motivator. Children push harder when they can see how their classmates are progressing. They also form friendships around a shared passion, which keeps them engaged over months and years.</p>
        <p>Group classes are also more affordable, making consistent, long-term learning accessible to more families.</p>
        <p><strong>Best for:</strong> Beginners and intermediate students who are learning core concepts, students who are self-motivated, and children who benefit from social learning environments.</p>
        <h2>The Case for Private Coaching</h2>
        <p>Private coaching is fundamentally different: 100% of the coach&apos;s attention is on your child for the entire session. Every weakness is identified and addressed immediately. Every strength is developed specifically. The curriculum is built around your child&apos;s goals — not a generic progression for a group.</p>
        <p>For students with tournament ambitions, private coaching accelerates development significantly. A coach can spend an entire session on one specific opening weakness, or on the endgame technique needed for an upcoming event. That level of personalisation is simply not possible in a group setting.</p>
        <p>Private coaching also offers complete scheduling flexibility — sessions can be rescheduled without affecting other students, and the pace of the curriculum can be adjusted week to week.</p>
        <p><strong>Best for:</strong> Students with specific tournament goals, children who need extra attention or have a particular learning style, and advanced students preparing for rated competitions.</p>
        <h2>Our Recommendation</h2>
        <p>For most students, the ideal path is to start in a group batch — build fundamentals, develop confidence, and discover whether chess is genuinely their passion. Once a student has shown consistent dedication and is ready to compete seriously, adding private sessions (or transitioning fully) accelerates their development substantially.</p>
        <p>Not sure where your child fits? Our free trial session includes a level assessment and a coach recommendation — specific to your child&apos;s ability, learning style, and goals. There is no obligation, and it costs nothing.</p>
      </>
    ),
  },
];

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Blog | Chaturangveda' };
  return {
    title: `${post.title} | Chaturangveda`,
    description: `${post.category} · ${post.readTime}`,
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const idx = posts.indexOf(post);
  const prev = posts[idx - 1];
  const next = posts[idx + 1];

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.postMeta}>
            <span className={styles.postCategory}>{post.category}</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
        </div>
      </section>

      <div className={styles.featuredImage}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover', objectPosition: post.imagePosition || 'center' }}
          priority
        />
      </div>

      <article className={styles.article}>
        <div className={styles.articleBody}>
          {post.content}
        </div>

        {/* Prev / Next nav */}
        <div className={styles.postNav}>
          {prev ? (
            <Link href={`/blogs/${prev.slug}`} className={styles.navLink}>
              <span className={styles.navDir}>← Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/blogs/${next.slug}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
              <span className={styles.navDir}>Next →</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          ) : <div />}
        </div>

        <div className={styles.postCta}>
          <h3 className={styles.postCtaTitle}>Inspired? Start Your Chess Journey Today.</h3>
          <p className={styles.postCtaSub}>Book a free 45-minute trial with a FIDE-rated coach. Zero obligation.</p>
          <Link href="/book-free-trial" className="btn-primary">Book Free Trial →</Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
