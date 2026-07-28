import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Copy,
  MessageSquare,
  Send,
  Sparkles,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { conversationService } from "@/services/conversation.service";
import { CATEGORY_LABEL } from "@/lib/mock-data";
import type { Conversation, Message } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conversations/$id")({
  head: () => ({
    meta: [{ title: "Conversation — AI Student Support" }],
  }),
  component: ConversationDetail,
});

function ConversationDetail() {
  const { id } = useParams({ from: "/_authenticated/conversations/$id" });
  const navigate = useNavigate();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "responding">("idle");
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const reload = async () => {
    const r = await conversationService.get(id);
    if (r.success) setConv(r.data);
  };

  useEffect(() => {
    conversationService.get(id).then((r) => {
      if (r.success) setConv(r.data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [conv?.messages.length, status]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || status !== "idle" || !conv) return;
    setError(null);
    setInput("");

    const optimistic: Message = {
      id: "tmp-" + Date.now(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setConv((c) => c ? { ...c, messages: [...c.messages, optimistic] } : c);
    setStatus("searching");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("responding");

    const r = await conversationService.sendMessage(conv.id, trimmed);
    setStatus("idle");
    if (!r.success) {
      setConv((c) => c ? { ...c, messages: c.messages.filter((m) => m.id !== optimistic.id) } : c);
      setError(r.error.message);
      setInput(trimmed);
      return;
    }
    setConv((c) => {
      if (!c) return c;
      const msgs = c.messages.filter((m) => m.id !== optimistic.id);
      return { ...c, messages: [...msgs, r.data.userMessage, r.data.aiMessage] };
    });
  };

  const remove = async () => {
    await conversationService.remove(id);
    toast.success("Deleted");
    navigate({ to: "/conversations" });
  };

  const save = async () => {
    await conversationService.toggleSave(id);
    await reload();
    toast.success(conv?.saved ? "Removed from saved" : "Saved");
  };

  const copyAll = () => {
    if (!conv) return;
    const text = conv.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Conversation copied");
  };

  if (loading) return <div className="surface-card p-6 animate-pulse h-64" />;

  if (!conv) {
    return (
      <div className="surface-card p-10 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 font-semibold">Conversation not found</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/conversations">Back to conversations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-6rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b shrink-0">
        <Link
          to="/conversations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All conversations
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyAll}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={save}>
            <Bookmark className={`h-4 w-4 mr-2 ${conv.saved ? "text-brand fill-brand" : ""}`} />
            {conv.saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" onClick={remove}>
            <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Delete
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="py-4 border-b shrink-0">
        <h1 className="text-lg font-semibold">{conv.title}</h1>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5">{CATEGORY_LABEL[conv.category]}</span>
          <span>{new Date(conv.updatedAt).toLocaleString()}</span>
          <span>{conv.messages.filter((m) => m.role === "user").length} questions</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scroller} className="flex-1 overflow-y-auto py-6 space-y-6">
        {conv.messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-sm text-brand-foreground whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-brand">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="max-w-[85%] min-w-0 space-y-2">
                <div className="rounded-2xl rounded-tl-sm bg-muted/60 border px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s) => (
                      <span
                        key={s.title}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        <BookOpen className="h-3 w-3 text-brand" /> {s.title}
                        <span className="text-muted-foreground/60">· {s.reference}</span>
                      </span>
                    ))}
                  </div>
                )}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-brand/40 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {status !== "idle" && (
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-brand">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted/60 border px-4 py-3 text-sm text-muted-foreground inline-flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce [animation-delay:240ms]" />
              </span>
              {status === "searching" ? "Searching academic information…" : "Preparing your response…"}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <div className="font-medium text-destructive">Something went wrong</div>
            <p className="mt-1 text-muted-foreground">{error}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={send}>
                <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setError(null)}>Dismiss</Button>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t pt-3 shrink-0">
        <div className="rounded-xl border bg-card focus-within:ring-2 focus-within:ring-ring">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
            }}
            placeholder="Continue this conversation…"
            rows={2}
            disabled={status !== "idle"}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm outline-none max-h-40 disabled:opacity-50"
          />
          <div className="flex items-center justify-between gap-2 px-3 pb-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Enter to send · Shift+Enter for new line
            </span>
            <Button onClick={() => void send()} disabled={status !== "idle" || !input.trim()} size="sm">
              <Send className="h-4 w-4 mr-2" /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
