import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Clock,
  ShieldCheck,
  BookOpen,
  History,
  MessageSquare,
  BadgeCheck,
  ThumbsUp,
  Send,
  Brain,
  Rocket,
  ChevronRight,
  GraduationCap,
  Wallet,
  CalendarDays,
  ScrollText,
  Building2,
  LifeBuoy,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-Powered Student Support System — Academic Support, Powered by AI" },
      {
        name: "description",
        content:
          "Fast, reliable AI answers for admissions, course registration, tuition, examinations, graduation, and more. Available 24/7 to students.",
      },
      { property: "og:title", content: "AI-Powered Student Support System" },
      {
        property: "og:description",
        content: "Academic support, powered by AI. Get answers to your academic questions anytime.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />
      <Hero />
      <Trust />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Categories />
      <Stats />
      <FaqPreview />
      <CTA />
      <LandingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(60% 55% at 20% 10%, oklch(0.9 0.05 258) 0%, transparent 60%), radial-gradient(45% 55% at 90% 20%, oklch(0.92 0.06 190) 0%, transparent 60%)",
        }}
      />
      <div className="container-page pt-14 pb-16 md:pt-24 md:pb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Available 24/7 • Secure • Built for Students
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Academic Support,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--brand-deep), var(--brand))" }}>
              Powered by AI.
            </span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            Get fast, reliable answers to your academic questions anytime, anywhere.
            From registration to graduation, we're here for every step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/support">
                Ask a Question <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Explore Features</a>
            </Button>
          </div>
        </div>
        <HeroIllustration />
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      <div className="surface-card p-5 md:p-6 shadow-elevated">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-brand-foreground">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium">AI Academic Assistant</div>
            <div className="text-xs text-muted-foreground">Online and ready to help</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> Live
          </span>
        </div>
        <div className="mt-5 space-y-4">
          <MessageBubble role="user" text="How do I register for courses this semester?" />
          <MessageBubble
            role="assistant"
            text="Registration opens two weeks before term begins. From the Student Portal, open Academic Services, choose your term, add courses, and confirm your schedule."
          />
          <div className="flex flex-wrap gap-2">
            {["Add or drop a course?", "What if a course is full?"].map((t) => (
              <span key={t} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 hidden md:flex items-center gap-3 rounded-xl bg-card border shadow-card p-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal/10 text-teal">
          <BadgeCheck className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium">Institutional sources</div>
          <div className="text-[11px] text-muted-foreground">Answers cite official guides</div>
        </div>
      </div>
      <div className="absolute -top-4 -right-3 hidden md:flex items-center gap-3 rounded-xl bg-card border shadow-card p-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium">Under 10s response</div>
          <div className="text-[11px] text-muted-foreground">Sample platform target</div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-4 py-2.5 text-sm text-brand-foreground shadow-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-brand">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-2.5 text-sm text-foreground">
        {text}
      </div>
    </div>
  );
}

function Trust() {
  const items = [
    { icon: ShieldCheck, label: "Secure by design" },
    { icon: Clock, label: "24/7 availability" },
    { icon: BadgeCheck, label: "Institutional sources" },
    { icon: ThumbsUp, label: "Student-first UX" },
  ];
  return (
    <section className="border-y bg-muted/40">
      <div className="container-page py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <it.icon className="h-4 w-4 text-brand" />
            {it.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProblemSolution() {
  const problems = [
    "Long response times to student inquiries",
    "Repetitive questions overwhelm staff",
    "Inconsistent answers across departments",
    "Limited support outside office hours",
  ];
  const solutions = [
    "Immediate AI-powered responses",
    "Consistent answers from approved sources",
    "24/7 availability from any device",
    "Centralized academic knowledge",
  ];
  return (
    <section className="container-page py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            The problem
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Support that can't scale</h2>
          <ul className="mt-6 space-y-3">
            {problems.map((p) => (
              <li key={p} className="flex gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-8">
          <div className="text-sm font-medium text-brand uppercase tracking-wide">Our solution</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            One assistant, every question
          </h2>
          <ul className="mt-6 space-y-3">
            {solutions.map((s) => (
              <li key={s} className="flex gap-3">
                <BadgeCheck className="h-5 w-5 text-teal shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI Academic Assistant",
      desc: "Ask academic questions and receive immediate, helpful responses.",
    },
    {
      icon: Clock,
      title: "24/7 Student Support",
      desc: "Get assistance whenever you need it, including outside office hours.",
    },
    {
      icon: BookOpen,
      title: "Academic Knowledge",
      desc: "Answers based on approved institutional information.",
    },
    {
      icon: History,
      title: "Conversation History",
      desc: "Review your previous questions and responses anytime.",
    },
    {
      icon: MessageSquare,
      title: "Smart FAQs",
      desc: "Discover common questions and answers quickly.",
    },
    {
      icon: ThumbsUp,
      title: "Feedback System",
      desc: "Rate responses and help improve the support experience.",
    },
  ];
  return (
    <section id="features" className="border-t bg-muted/30">
      <div className="container-page py-20">
        <SectionHead
          eyebrow="Features"
          title="Everything students need to stay on track"
          subtitle="Purpose-built for academic support, not general-purpose chat."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="surface-card p-6 hover:shadow-elevated transition-shadow">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Send, title: "Ask Your Question", desc: "Type any academic question in plain language." },
    { icon: Brain, title: "AI Understands", desc: "The assistant interprets your request and finds relevant guidance." },
    { icon: MessageSquare, title: "Receive a Helpful Response", desc: "Get a clear answer with links to institutional sources." },
    { icon: Rocket, title: "Continue Learning", desc: "Follow up, save answers, or contact human support if needed." },
  ];
  return (
    <section id="how" className="container-page py-20">
      <SectionHead eyebrow="How it works" title="Four steps to an answer" />
      <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="surface-card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-foreground text-sm font-semibold">
                {i + 1}
              </span>
              <s.icon className="h-5 w-5 text-brand" />
            </div>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Categories() {
  const items = [
    { icon: ClipboardList, title: "Admissions" },
    { icon: BookOpen, title: "Course Registration" },
    { icon: Wallet, title: "Tuition and Fees" },
    { icon: ScrollText, title: "Examinations" },
    { icon: GraduationCap, title: "Graduation" },
    { icon: CalendarDays, title: "Academic Calendar" },
    { icon: Building2, title: "Campus Services" },
    { icon: LifeBuoy, title: "Student Support" },
  ];
  return (
    <section className="border-t bg-muted/30">
      <div className="container-page py-20">
        <SectionHead
          eyebrow="Support categories"
          title="Answers across the student journey"
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <Link
              key={c.title}
              to="/support"
              className="group surface-card p-5 hover:border-brand/40 hover:shadow-elevated transition"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="font-medium">{c.title}</div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-brand" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "24/7", label: "Support availability" },
    { value: "<10s", label: "Average response time" },
    { value: "8", label: "Academic categories" },
    { value: "1000s", label: "Questions supported" },
  ];
  return (
    <section className="container-page py-20">
      <div className="surface-card p-8 md:p-10">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">
          Sample platform statistics
        </div>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-semibold text-brand-deep">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqPreview() {
  const qs = [
    "How do I register for my courses?",
    "When do examinations begin?",
    "How can I check my graduation requirements?",
    "How do I contact student support?",
  ];
  return (
    <section id="faqs" className="border-t bg-muted/30">
      <div className="container-page py-20">
        <SectionHead eyebrow="FAQs" title="Common questions students ask" />
        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {qs.map((q) => (
            <li key={q}>
              <Link
                to="/faqs"
                className="flex items-center gap-3 surface-card p-4 hover:border-brand/40 transition"
              >
                <MessageSquare className="h-4 w-4 text-brand shrink-0" />
                <span className="text-sm">{q}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/faqs">View All FAQs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-page py-20">
      <div className="rounded-2xl p-10 md:p-14 text-center text-brand-foreground shadow-elevated gradient-brand">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Get the Academic Support You Need.
        </h2>
        <p className="mt-3 text-brand-foreground/80 max-w-xl mx-auto">
          Create your student account and start asking questions in minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Start Asking Questions</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-brand-foreground hover:bg-white/10 hover:text-brand-foreground">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-sm font-medium text-brand uppercase tracking-wide">{eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
