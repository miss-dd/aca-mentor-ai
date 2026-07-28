import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ClipboardList,
  GraduationCap,
  MessageSquare,
  Send,
  ScrollText,
  ThumbsUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { conversationService } from "@/services/conversation.service";
import { CATEGORY_LABEL, SAMPLE_PROMPTS } from "@/lib/mock-data";
import type { Conversation } from "@/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Student Support" },
      { name: "description", content: "Your student dashboard for AI academic support." },
    ],
  }),
  component: DashboardPage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [recent, setRecent] = useState<Conversation[]>([]);

  useEffect(() => {
    conversationService.list().then((r) => r.success && setRecent(r.data.slice(0, 3)));
  }, []);

  const ask = async () => {
    if (!question.trim()) return;
    navigate({ to: "/support", search: { q: question } as never });
  };

  const cats = [
    { label: "Registration", icon: BookOpen },
    { label: "Fees", icon: Wallet },
    { label: "Examinations", icon: ScrollText },
    { label: "Graduation", icon: GraduationCap },
  ];
  const stats = [
    { label: "Questions Asked", value: "12", icon: MessageSquare },
    { label: "This Month", value: "8", icon: ClipboardList },
    { label: "Helpful Responses", value: "10", icon: ThumbsUp },
    { label: "Saved Answers", value: "3", icon: Bookmark },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {greeting()}, {user?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="mt-1 text-muted-foreground">What would you like help with today?</p>
      </header>

      <section className="surface-card p-5 md:p-6">
        <label htmlFor="ask" className="text-sm font-medium">
          Ask an academic question
        </label>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            id="ask"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="e.g. How do I register for courses this semester?"
            className="flex-1 h-12 rounded-lg border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={ask} size="lg">
            <Send className="h-4 w-4 mr-2" /> Ask
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.slice(0, 4).map((p) => (
            <button
              key={p}
              onClick={() => setQuestion(p)}
              className="text-xs rounded-full border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-brand/40"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {cats.map((c) => (
          <Link
            key={c.label}
            to="/support"
            className="surface-card p-4 hover:border-brand/40 hover:shadow-elevated transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="font-medium text-sm">{c.label}</div>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-brand">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent conversations</h2>
          <Link to="/conversations" className="text-sm text-brand hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3">
          {recent.length === 0 && (
            <div className="surface-card p-6 text-sm text-muted-foreground">
              You haven't asked any questions yet. Start with the assistant above.
            </div>
          )}
          {recent.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <Link
                key={c.id}
                to="/conversations/$id"
                params={{ id: c.id }}
                className="surface-card p-4 hover:border-brand/40 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {last?.content}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {CATEGORY_LABEL[c.category]}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Popular questions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SAMPLE_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuestion(q);
                navigate({ to: "/support", search: { q } as never });
              }}
              className="surface-card p-4 text-left hover:border-brand/40 transition"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-brand shrink-0" />
                <span className="text-sm">{q}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
