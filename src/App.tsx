import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Star,
  Sparkles,
  Play,
  Menu,
  X,
  BookOpen,
  Calculator,
  Palette,
  Globe2,
  Smartphone,
  Users,
  School,
  Tent,
  Heart,
  Plus,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import heroKids from "@/assets/hero-kids.png";
import mascot from "@/assets/hero-mascot.png";

/* ---------- Helpers ---------- */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-primary-deep">
    {children}
  </p>
);

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`mt-2 text-4xl leading-tight text-ink sm:text-5xl md:text-6xl ${className}`}>
    {children}
  </h2>
);

const Squiggle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 140 14" className={className} fill="none" aria-hidden>
    <path
      d="M2 8 Q 18 1 34 8 T 70 8 T 106 8 T 138 8"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/* ---------- Nav ---------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Lessons", "#features"],
    ["Services", "#services"],
    ["Parents", "#testimonials"],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-ink bg-primary text-ink shadow-pencil">
            <span className="font-display text-2xl leading-none">D</span>
          </span>
          <span className="font-display text-3xl text-ink">Doodletown</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-bold text-ink/80 hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#signup"
          className="hidden items-center gap-2 rounded-full border-[3px] border-ink bg-sunshine px-5 py-2 text-sm font-extrabold text-ink shadow-pencil transition hover:-translate-y-0.5 md:inline-flex"
        >
          Sign in <Star className="h-4 w-4 fill-ink" />
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border-[2.5px] border-ink p-2 md:hidden cursor-pointer"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/10 bg-background md:hidden"
          >
            <div className="flex flex-col gap-3 px-5 py-4">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-base font-bold text-ink"
                >
                  {label}
                </a>
              ))}
              <a
                href="#signup"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-sunshine px-5 py-2 font-extrabold text-ink shadow-pencil"
              >
                Sign in <Star className="h-4 w-4 fill-ink" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- Signup form (with optional backend) ---------- */

function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setError("Please enter a valid email.");
      return;
    }
    if (value.length > 200) {
      setStatus("error");
      setError("That email looks too long.");
      return;
    }
    setStatus("loading");
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: value, source: "doodletown-landing" }),
        });
        if (!res.ok) throw new Error("Network");
      } else {
        // Local fallback: store in localStorage so it works out of the box.
        const list = JSON.parse(localStorage.getItem("doodletown:signups") || "[]");
        list.push({ email: value, at: new Date().toISOString() });
        localStorage.setItem("doodletown:signups", JSON.stringify(list));
        await new Promise((r) => setTimeout(r, 500));
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Try again?");
    }
  }

  if (status === "success") {
    return (
      <div className="border-sketch bg-mint/50 p-5 shadow-pencil">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-sunshine">
            <Check className="h-5 w-5 text-ink" strokeWidth={3} />
          </span>
          <div>
            <p className="font-display text-2xl text-ink">You're on the list! 🎉</p>
            <p className="text-sm font-semibold text-ink/80">
              Check your inbox — Doodletown is on its way.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          maxLength={200}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="grown-up@email.com"
          className="border-sketch-sm w-full bg-white px-5 py-3 font-bold text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-primary/40 sm:flex-1"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="border-sketch-sm cursor-pointer inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-base font-extrabold text-ink shadow-pencil transition hover:-translate-y-0.5 disabled:opacity-60 "
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Star className="h-5 w-5 fill-ink" /> Start learning — it's free!
            </>
          )}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-ink/70">
        <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary-deep" strokeWidth={3} /> No credit card</span>
        <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary-deep" strokeWidth={3} /> 2 weeks free</span>
        <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary-deep" strokeWidth={3} /> Ready in 60 seconds</span>
      </div>
      {status === "error" && (
        <p className="text-sm font-bold text-coral">{error}</p>
      )}
    </form>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <section ref={ref} id="signup" className="relative overflow-hidden">
      <motion.div style={{ y: y1 }} className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full bg-pink/60 blur-2xl" />
      <motion.div style={{ y: y2 }} className="pointer-events-none absolute right-10 top-32 h-32 w-32 rounded-full bg-sunshine/50 blur-2xl" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-pink/60 px-4 py-1 text-xs font-extrabold text-ink">
              <Sparkles className="h-3.5 w-3.5" /> For little explorers ages 4–10
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-5 text-6xl leading-[1.05] text-ink sm:text-7xl md:text-8xl"
          >
            Learning that <br />
            feels like <span className="underline-wiggle text-coral">play!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 max-w-md text-base font-semibold text-ink/75"
          >
            Doodletown is a cheerful little world where kids draw, read, count and discover —
            one sticker, one star, one giggle at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-7 max-w-lg"
          >
            <SignupForm />
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#features"
                className="border-sketch-sm inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-extrabold text-ink shadow-pencil hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-ink" /> Watch a tour
              </a>
            </div>
          </motion.div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-sunshine", "bg-coral", "bg-pink", "bg-primary"].map((c, i) => (
                <span key={i} className={`h-7 w-7 rounded-full border-[2.5px] border-ink ${c}`} />
              ))}
            </div>
            <p className="text-xs font-extrabold text-primary-deep">
              Loved by 120,000+ families in 40 countries
            </p>
          </div>
        </div>

        {/* Sketchbook frame */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="border-sketch relative bg-white p-6 shadow-pencil-lg"
          >
            <span className="absolute -left-3 -top-3 h-5 w-5 rounded-full border-[2.5px] border-ink bg-sunshine" />
            <span className="absolute -right-3 -top-3 h-5 w-5 rounded-full border-[2.5px] border-ink bg-pink" />
            <span className="absolute -bottom-3 -left-3 h-5 w-5 rounded-full border-[2.5px] border-ink bg-primary" />
            <span className="absolute -bottom-3 -right-3 h-5 w-5 rounded-full border-[2.5px] border-ink bg-coral" />
            <motion.img
              src={heroKids}
              alt="Kids reading a giant storybook together"
              className="mx-auto h-auto w-full max-w-md"
              style={{ rotate }}
            />
            <div className="mt-3 flex items-center gap-2 text-coral">
              <Squiggle className="h-3 w-24" />
              <p className="font-display text-2xl text-ink">Today's adventure: Outer Space!</p>
            </div>
          </motion.div>
         
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */

const features = [
  {
    icon: BookOpen,
    color: "bg-primary",
    title: "Read & Giggle",
    body: "Phonics, stories and silly songs that turn shy readers into bookworms.",
  },
  {
    icon: Calculator,
    color: "bg-coral",
    title: "Count & Conquer",
    body: "Math quests with friendly monsters, treasure maps and tasty cookies.",
  },
  {
    icon: Palette,
    color: "bg-pink",
    title: "Draw & Dream",
    body: "Open-ended sketchpads, sticker collections and creativity challenges.",
  },
  {
    icon: Globe2,
    color: "bg-mint",
    title: "Explore the World",
    body: "Animals, planets, oceans — curiosity-led discovery, no boring textbooks.",
  },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <SectionLabel>What's inside</SectionLabel>
          <SectionTitle>A whole town of fun stuff</SectionTitle>
        </div>
        <Squiggle className="hidden h-4 w-32 text-primary md:block" />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
            className="border-sketch bg-white p-5 shadow-pencil"
          >
            <span className={`grid h-12 w-12 place-items-center rounded-2xl border-[2.5px] border-ink ${f.color}`}>
              <f.icon className="h-6 w-6 text-ink" strokeWidth={2.4} />
            </span>
            <h3 className="mt-4 text-2xl text-ink">{f.title}</h3>
            <p className="mt-1 text-sm font-semibold text-ink/75">{f.body}</p>
            <a href="#signup" className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-primary-deep">
              Peek inside <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Services ---------- */

const services = [
  {
    icon: Smartphone,
    color: "bg-sunshine",
    tag: "Kids App",
    title: "Doodletown Daily",
    body: "A 15-minute everyday quest mixing reading, math and a creative challenge. New worlds every week.",
    chips: ["100+ mini-games", "Offline mode", "Voice-friendly"],
  },
  {
    icon: Users,
    color: "bg-pink",
    tag: "Family Plan",
    title: "Grown-up Co-pilot",
    body: "A parent dashboard that turns progress into plain language and suggests cozy at-home activities.",
    chips: ["Weekly reports", "Up to 4 kids", "Screen-time guard"],
  },
  {
    icon: School,
    color: "bg-primary",
    tag: "Classrooms",
    title: "Doodletown for Schools",
    body: "Teacher-led playlists, classroom leaderboards (kind ones!) and printable sticker packs.",
    chips: ["Roster sync", "K–4 standards", "Teacher trainings"],
  },
  {
    icon: Tent,
    color: "bg-mint",
    tag: "Workshops",
    title: "Doodle Camps",
    body: "Live weekend art and storytelling camps hosted by friendly real human artists.",
    chips: ["Small groups", "Live mentors", "Take-home zines"],
  },
];

function Services() {
  return (
    <section id="services" className="bg-paper-warm py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionLabel>Our services</SectionLabel>
        <SectionTitle>Pick your kind of fun</SectionTitle>
        <p className="mt-3 max-w-xl text-base font-semibold text-ink/75">
          From everyday adventures to live camps — there's a Doodletown for every little human.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="border-sketch bg-white p-6 shadow-pencil"
            >
              <div className="flex items-start gap-4">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-[2.5px] border-ink ${s.color}`}>
                  <s.icon className="h-6 w-6 text-ink" strokeWidth={2.4} />
                </span>
                <div className="flex-1">
                  <span className="inline-block rounded-md border-[2px] border-dashed border-ink/60 bg-paper px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink/70">
                    {s.tag}
                  </span>
                  <h3 className="mt-1 text-2xl text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-ink/75">{s.body}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.chips.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-full border-[2px] border-dashed border-ink/70 bg-paper px-3 py-1 text-xs font-extrabold text-ink"
                      >
                        <Check className="h-3 w-3 text-primary-deep" strokeWidth={3} /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

const steps = [
  { n: 1, color: "bg-sunshine", title: "Pick a buddy", body: "Choose your fluffy mascot to join the adventure." },
  { n: 2, color: "bg-primary", title: "Play & learn", body: "Bite-size lessons, games and silly surprises every day." },
  { n: 3, color: "bg-pink", title: "Collect stars", body: "Earn stickers, unlock new worlds, share with grown-ups." },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="text-center">
        <SectionTitle>How Doodletown works</SectionTitle>
        <p className="mt-2 text-base font-semibold text-ink/75">
          Three teeny steps and you're off exploring.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="border-sketch relative bg-white p-6 shadow-pencil"
          >
            <span className={`absolute -top-5 left-6 grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink font-display text-2xl ${s.color}`}>
              {s.n}
            </span>
            <h3 className="mt-4 text-2xl text-ink">{s.title}</h3>
            <p className="mt-1 text-sm font-semibold text-ink/75">{s.body}</p>
            <Squiggle className="mt-4 h-3 w-24 text-primary" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

const testimonials = [
  { color: "bg-coral", name: "Maya R.", role: "Parent of Zoe, age 6", quote: "My daughter actually asks to do her lessons. That has literally never happened before." },
  { color: "bg-primary", name: "Daniel & Theo", role: "Dad of Theo, age 8", quote: "The math quests turned screen time into our favorite family ritual. We do them together!" },
  { color: "bg-mint", name: "Ms. Patel", role: "1st grade teacher", quote: "I use Doodletown for my whole 1st grade class. Kids cheer when I open it on the smartboard." },
  { color: "bg-pink", name: "Hannah K.", role: "Mom of twins, age 5", quote: "Best part: no scary ads, no weird chats. I trust it on the iPad without standing over them." },
  { color: "bg-sunshine", name: "Olu A.", role: "Parent of Ada, age 7", quote: "My shy little reader is now narrating bedtime stories to her stuffed animals. Worth every penny." },
  { color: "bg-primary/70", name: "Sam W.", role: "Dad of Leo, age 5", quote: "It's the only app where my kid celebrates getting something wrong because the monster dances." },
];

function Testimonials() {
  return (
    <section id="testimonials" className="bg-paper-warm py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionLabel>Happy families</SectionLabel>
        <SectionTitle>Kind words from <br className="hidden sm:block" /> grown-ups</SectionTitle>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              className="border-sketch bg-white p-5 shadow-pencil"
            >
              <div className="flex gap-1 text-sunshine">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-sunshine" strokeWidth={2} />
                ))}
              </div>
              <p className="mt-3 text-base font-semibold text-ink/85">&#8220;{t.quote}&#8221;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className={`h-9 w-9 rounded-full border-[2.5px] border-ink ${t.color}`} />
                <div>
                  <p className="text-sm font-extrabold text-ink">{t.name}</p>
                  <p className="text-xs font-semibold text-ink/60">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const faqs = [
  { q: "What ages is Doodletown for?", a: "Kids ages 4 to 10. Content adapts to your child's reading and math level as they play." },
  { q: "Is it safe? No ads, no chat?", a: "Yes. Doodletown has zero third-party ads and no open chat — it's a closed, kid-only world." },
  { q: "How much screen time?", a: "We recommend 15–20 minutes a day. Built-in gentle timers help wind things down." },
  { q: "Does it work offline?", a: "Most lessons download automatically so your child can play on planes, car rides, and beyond." },
  { q: "Can I try before I pay?", a: "Two full weeks free. No credit card required to start exploring." },
  { q: "Do you support classrooms?", a: "Yes! Teachers get a free classroom plan with roster sync and printable activity packs." },
];

function FAQ() {
  const [open, setOpen] = useState(-1);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
      <div className="text-center">
        <SectionLabel>Tiny questions</SectionLabel>
        <SectionTitle>Big answers</SectionTitle>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              layout
              className="border-sketch bg-white px-5 py-4 shadow-pencil"
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex cursor-pointer w-full items-center justify-between gap-4 text-left "
              >
                <span className="text-lg font-extrabold text-ink">{f.q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-[2.5px] border-ink ${isOpen ? "bg-white"  : "bg-sunshine" }`}>
                  {isOpen ? <X className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" strokeWidth={3} />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden text-sm font-semibold text-ink/75"
                  >
                    <span className="mt-2 block">{f.a}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="border-sketch relative bg-paper p-10 text-center shadow-pencil-lg sm:p-14">
        <Star className="absolute left-6 top-6 h-6 w-6 fill-sunshine text-ink" />
        <Star className="absolute right-6 top-6 h-6 w-6 fill-pink text-ink" />
        <Heart className="absolute bottom-6 left-6 h-6 w-6 fill-coral text-ink" />
        <img src={mascot} alt="" aria-hidden className="wiggle mx-auto h-20 w-20" />
        <h2 className="mt-2 text-5xl text-ink sm:text-6xl">Ready to doodle?</h2>
        <p className="mt-2 text-base font-semibold text-ink/75">
          Two weeks free. No credit card needed. Just curious little humans.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#signup"
            className="border-sketch-sm inline-flex items-center gap-2 bg-primary px-6 py-3 font-extrabold text-ink shadow-pencil hover:-translate-y-0.5"
          >
            Start free trial <Star className="h-4 w-4 fill-ink" />
          </a>
          <a
            href="#services"
            className="border-sketch-sm inline-flex items-center gap-2 bg-white px-6 py-3 font-extrabold text-ink shadow-pencil hover:-translate-y-0.5"
          >
            For schools <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-background py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-ink/70 sm:flex-row">
        <p className="font-display text-2xl text-ink">Doodletown</p>
        <p>© {new Date().getFullYear()} Made with <span className="text-coral">♥</span> for curious kids.</p>
        <div className="flex gap-4 font-bold">
          <a href="#" className="hover:text-ink">Privacy</a>
          <a href="#" className="hover:text-ink">Help</a>
          <a href="#" className="hover:text-ink">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- App ---------- */

export default function App() {
  useEffect(() => {
    document.title = "Doodletown — Playful Learning for Curious Kids";
  }, []);
  return (
    <div className="min-h-screen selection:bg-primary selection:text-ink  [&::-webkit-scrollbar]:w-3
  [&::-webkit-scrollbar-track]:bg-paper
  [&::-webkit-scrollbar-thumb]:bg-primary
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:border-2
  [&::-webkit-scrollbar-thumb]:border-ink
  [&::-webkit-scrollbar-thumb:hover]:bg-primary-deep">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Services />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
