import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, MessageSquare, Bookmark, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, CATEGORIES } from "@/lib/mock-data";
import { conversationService } from "@/services/conversation.service";
import type { Conversation, Category } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conversations/")({
  head: () => ({
    meta: [
      { title: "My Conversations — AI Student Support" },
      { name: "description", content: "Browse and search your previous AI conversations." },
    ],
  }),
  component: ConversationsPage,
});

function ConversationsPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const load = () => {
    setLoading(true);
    conversationService.list().then((r) => {
      if (r.success) setItems(r.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = items;
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q)),
      );
    }
    list = [...list].sort((a, b) =>
      sort === "newest" ? (a.updatedAt < b.updatedAt ? 1 : -1) : a.updatedAt > b.updatedAt ? 1 : -1,
    );
    return list;
  }, [items, query, category, sort]);

  const remove = async (id: string) => {
    await conversationService.remove(id);
    toast.success("Conversation deleted");
    load();
  };
  const toggleSave = async (id: string) => {
    await conversationService.toggleSave(id);
    load();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">My Conversations</h1>
        <p className="mt-1 text-muted-foreground">Search and revisit your previous questions.</p>
      </header>

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">
            {items.length === 0 ? "No conversations yet" : "No results"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length === 0
              ? "Start a conversation to see it here."
              : "Try adjusting your search or filters."}
          </p>
          {items.length === 0 && (
            <Button asChild className="mt-4">
              <Link to="/support">Ask a question</Link>
            </Button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <li key={c.id} className="surface-card p-4 hover:border-brand/40 transition">
                <div className="flex items-start justify-between gap-4">
                  <Link
                    to="/conversations/$id"
                    params={{ id: c.id }}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{c.title}</div>
                      {c.saved && <Bookmark className="h-3.5 w-3.5 text-brand fill-brand" />}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {last?.content}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {CATEGORY_LABEL[c.category]}
                      </span>
                      <span>{new Date(c.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleSave(c.id)} aria-label="Save">
                      <Bookmark className={`h-4 w-4 ${c.saved ? "text-brand fill-brand" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(c.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
