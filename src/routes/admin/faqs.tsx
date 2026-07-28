import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin.service";
import { CATEGORY_LABEL, CATEGORIES } from "@/lib/mock-data";
import type { FAQ, Category } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/faqs")({
  head: () => ({ meta: [{ title: "FAQs — Admin" }] }),
  component: AdminFaqsPage,
});

type FormState = { question: string; answer: string; category: Category };
const EMPTY_FORM: FormState = { question: "", answer: "", category: "support" };

function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [editing, setEditing] = useState<string | null>(null); // faq id or "new"
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminService.listFaqs().then((r) => {
      if (r.success) setFaqs(r.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = faqs;
    if (cat !== "all") list = list.filter((f) => f.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
      );
    }
    return list;
  }, [faqs, query, cat]);

  const startEdit = (faq: FAQ) => {
    setEditing(faq.id);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category });
  };

  const startNew = () => {
    setEditing("new");
    setForm(EMPTY_FORM);
  };

  const cancel = () => { setEditing(null); setForm(EMPTY_FORM); };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    setSaving(true);
    if (editing === "new") {
      await adminService.createFaq(form);
      toast.success("FAQ created");
    } else if (editing) {
      await adminService.updateFaq(editing, form);
      toast.success("FAQ updated");
    }
    setSaving(false);
    cancel();
    load();
  };

  const remove = async (id: string) => {
    await adminService.deleteFaq(id);
    toast.success("FAQ deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">FAQs</h1>
          <p className="mt-1 text-muted-foreground">Manage frequently asked questions shown to students.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4 mr-2" /> New FAQ
        </Button>
      </header>

      {/* Create / Edit form */}
      {editing && (
        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">{editing === "new" ? "New FAQ" : "Edit FAQ"}</h2>
          <div>
            <Label>Question</Label>
            <Input
              className="mt-1.5"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Enter the question…"
            />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea
              className="mt-1.5"
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Enter the answer…"
            />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={cancel}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving…
                </span>
              ) : (
                <><Check className="h-4 w-4 mr-2" /> Save</>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs…"
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
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="surface-card h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">
          No FAQs found. Create one above.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((f) => (
            <li key={f.id} className="surface-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{f.question}</div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{f.answer}</p>
                  <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {CATEGORY_LABEL[f.category]}
                    </span>
                    <span>Updated {f.updatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(f)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(f.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
