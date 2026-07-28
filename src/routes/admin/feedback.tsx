import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ThumbsUp, ThumbsDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin.service";
import { CATEGORY_LABEL, CATEGORIES } from "@/lib/mock-data";
import type { FeedbackEntry, Category } from "@/types";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({ meta: [{ title: "Feedback — Admin" }] }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [rating, setRating] = useState<"all" | "helpful" | "not_helpful">("all");

  useEffect(() => {
    adminService.listFeedback().then((r) => {
      if (r.success) setEntries(r.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = entries;
    if (cat !== "all") list = list.filter((e) => e.category === cat);
    if (rating !== "all") list = list.filter((e) => e.rating === rating);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.question.toLowerCase().includes(q));
    }
    return list;
  }, [entries, query, cat, rating]);

  const helpful = entries.filter((e) => e.rating === "helpful").length;
  const notHelpful = entries.filter((e) => e.rating === "not_helpful").length;
  const total = entries.length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Feedback</h1>
        <p className="mt-1 text-muted-foreground">Review student ratings on AI responses.</p>
      </header>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-3">
        <div className="surface-card p-5 text-center">
          <div className="text-3xl font-semibold">{total}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Ratings</div>
        </div>
        <div className="surface-card p-5 text-center">
          <div className="text-3xl font-semibold text-success">{helpful}</div>
          <div className="text-xs text-muted-foreground mt-1">Helpful</div>
          <div className="text-xs text-success mt-0.5">
            {total ? Math.round((helpful / total) * 100) : 0}%
          </div>
        </div>
        <div className="surface-card p-5 text-center">
          <div className="text-3xl font-semibold text-destructive">{notHelpful}</div>
          <div className="text-xs text-muted-foreground mt-1">Not Helpful</div>
          <div className="text-xs text-destructive mt-0.5">
            {total ? Math.round((notHelpful / total) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by question…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as Category | "all")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
          ))}
        </select>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value as "all" | "helpful" | "not_helpful")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All ratings</option>
          <option value="helpful">Helpful</option>
          <option value="not_helpful">Not helpful</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="surface-card h-16 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">
          No feedback entries match your filters.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => (
            <li key={e.id} className="surface-card p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    e.rating === "helpful"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {e.rating === "helpful" ? (
                    <ThumbsUp className="h-4 w-4" />
                  ) : (
                    <ThumbsDown className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{e.question}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {CATEGORY_LABEL[e.category]}
                    </span>
                    <span>Student {e.studentId}</span>
                    <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
