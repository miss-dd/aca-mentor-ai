import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  LifeBuoy,
  Loader2,
  Shield,
  ActivitySquare,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — AI Student Support" },
      { name: "description", content: "Help articles, contact support, and system status." },
    ],
  }),
  component: HelpPage,
});

const ARTICLES = [
  {
    id: "a1",
    category: "Getting Started",
    question: "How do I ask the AI assistant a question?",
    answer:
      "Navigate to Ask AI in the sidebar. Type your question in the text box at the bottom and press Enter or click Send. The assistant will search institutional knowledge and reply within seconds. You can follow up with additional questions in the same conversation.",
  },
  {
    id: "a2",
    category: "Getting Started",
    question: "What kinds of questions can I ask?",
    answer:
      "The assistant is trained on institutional academic information. It can help with course registration, tuition and fees, examination schedules, graduation requirements, academic calendar dates, campus services, and general student support. For personal account issues (e.g. billing disputes), please contact the relevant department directly.",
  },
  {
    id: "a3",
    category: "Conversations",
    question: "How do I find a previous conversation?",
    answer:
      "Open My Conversations from the sidebar. You can search by keyword, filter by category, and sort by newest or oldest. Click any conversation to read the full exchange. Use the Bookmark icon to save important conversations for quick access.",
  },
  {
    id: "a4",
    category: "Conversations",
    question: "Can I delete a conversation?",
    answer:
      "Yes. Open the conversation and click the Delete button in the top-right toolbar, or use the trash icon on the Conversations list page. Deleted conversations cannot be recovered.",
  },
  {
    id: "a5",
    category: "Account",
    question: "How do I update my profile information?",
    answer:
      "Go to Profile in the sidebar. You can update your display name, program, department, and year level. Click Save Changes when done. Your institutional email and student ID are managed by your institution and cannot be changed here.",
  },
  {
    id: "a6",
    category: "Account",
    question: "How do I change my password?",
    answer:
      "On the Profile page, click Change Password. Enter your current password, then your new password twice. Passwords must be at least 8 characters. Click Update Password to save.",
  },
  {
    id: "a7",
    category: "Resources",
    question: "How do I download an academic resource?",
    answer:
      "Open Academic Resources from the sidebar. Browse or search for the document you need, then click Download. The system will generate a secure, time-limited download link. If the link expires, simply click Download again.",
  },
  {
    id: "a8",
    category: "Feedback",
    question: "How does the feedback system work?",
    answer:
      "After each AI response, you can click the thumbs-up or thumbs-down icon to rate it. Helpful ratings reinforce good answers. Not-helpful ratings are reviewed by administrators to improve the knowledge base. Your feedback is anonymous.",
  },
  {
    id: "a9",
    category: "Technical",
    question: "The page is not loading correctly. What should I do?",
    answer:
      "Try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If the issue persists, clear your browser cache and cookies for this site, then sign in again. If you still experience problems, submit a support request below with a description of the issue and your browser version.",
  },
  {
    id: "a10",
    category: "Technical",
    question: "Why is the AI response taking a long time?",
    answer:
      "Response times are typically under 10 seconds. Occasional delays may occur during peak usage. If a response takes more than 30 seconds, click Retry. If the problem persists, check the system status cards at the top of this page and submit a support request if a service shows degraded status.",
  },
];

const CATEGORIES = [...new Set(ARTICLES.map((a) => a.category))];

function HelpPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: "", category: "support", description: "", priority: "normal" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return ARTICLES;
    const q = query.toLowerCase();
    return ARTICLES.filter(
      (a) => a.question.toLowerCase().includes(q) || a.answer.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof ARTICLES>();
    for (const cat of CATEGORIES) map.set(cat, []);
    for (const a of filtered) map.get(a.category)?.push(a);
    return [...map.entries()].filter(([, items]) => items.length > 0);
  }, [filtered]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setDone(true);
    toast.success("Support request submitted");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Help & Support</h1>
        <p className="mt-1 text-muted-foreground">Browse help articles or contact the support team.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatusCard icon={ActivitySquare} label="Platform" value="Operational" tone="ok" />
        <StatusCard icon={Shield} label="Security" value="All systems normal" tone="ok" />
        <StatusCard icon={LifeBuoy} label="Support" value="Response ≈ 2 hrs" tone="info" />
      </div>

      {/* Search */}
      <div className="surface-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Articles */}
      {filtered.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No articles match your search.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/support">Ask the AI Assistant</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([cat, items]) => (
            <div key={cat} className="surface-card overflow-hidden">
              <div className="px-5 py-3 border-b bg-muted/30">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {cat}
                </span>
              </div>
              <ul>
                {items.map((a, i) => (
                  <li key={a.id} className={i > 0 ? "border-t" : ""}>
                    <button
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/30 transition"
                      onClick={() => setOpenId(openId === a.id ? null : a.id)}
                      aria-expanded={openId === a.id}
                    >
                      <span className="text-sm font-medium">{a.question}</span>
                      {openId === a.id ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {openId === a.id && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {a.answer}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Still need help */}
      <div className="surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="font-medium text-sm">Still need help?</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            The AI assistant can answer most academic questions instantly.
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link to="/support">
              <MessageSquare className="h-4 w-4 mr-2" /> Ask AI
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="#contact">
              <ExternalLink className="h-4 w-4 mr-2" /> Contact
            </a>
          </Button>
        </div>
      </div>

      {/* Contact form */}
      <div id="contact">
        {done ? (
          <div className="surface-card p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-semibold">We've received your request</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The support team will reply to your institutional email within 2 hours.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>
              Submit another
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="surface-card p-6 space-y-5">
            <h2 className="font-semibold">Contact support</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Subject">
                <Input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="support">General Support</option>
                  <option value="account">Account</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">Feedback</option>
                </select>
              </Field>
              <Field label="Priority">
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your issue in detail…"
              />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Submit request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof LifeBuoy;
  label: string;
  value: string;
  tone: "ok" | "info";
}) {
  const color = tone === "ok" ? "text-success" : "text-brand";
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-lg bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className={`text-sm font-medium ${color}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}
