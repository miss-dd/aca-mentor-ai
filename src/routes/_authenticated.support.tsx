import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Bookmark,
  Info,
  Plus,
  BookOpen,
  History,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { conversationService } from "@/services/conversation.service";
import { feedbackService } from "@/services/feedback.service";
import { SAMPLE_PROMPTS } from "@/lib/mock-data";
import type { Conversation, Message } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({
    meta: [
      { title: "Ask AI — Student Support" },
      { name: "description", content: "Ask academic questions and receive AI-powered answers." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : undefined }),
  component: SupportPage,
});

function SupportPage() {
  const { q } = useSearch({ from: "/_authenticated/support" });
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "responding">("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q) { setInput(""); void send(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || status !== "idle") return;
    setError(null);
    setLastInput(trimmed);

    let conv = conversation;
    if (!conv) {
      const r = await conversationService.create(trimmed);
      if (!r.success) return setError(r.error.message);
      conv = r.data;
      setConversation(conv);
    }

    const userMsg: Message = {
      id: "tmp-" + Date.now(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setStatus("searching");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("responding");

    const r = await conversationService.sendMessage(conv.id, trimmed);
    setStatus("idle");
    if (!r.success) { setError(r.error.message); return; }
    setMessages((m) => [
      ...m.filter((x) => x.id !== userMsg.id),
      r.data.userMessage,
      r.data.aiMessage,
    ]);
  };

  const retry = () => { if (lastInput) void send(lastInput); };

  const startNew = () => {
    setConversation(null);
    setMessages([]);
    setError(null);
    setInput("");
    setLastInput("");
  };

  const saveRename = async () => {
    if (!conversation || !titleDraft.trim()) { setEditingTitle(false); return; }
    await conversationService.rename(conversation.id, titleDraft.trim());
    setConversation((c) => c ? { ...c, title: titleDraft.trim() } : c);
    setEditingTitle(false);
    toast.success("Conversation renamed");
  };

  const startEditTitle = () => {
    setTitleDraft(conversation?.title ?? "");
    setEditingTitle(true);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-6rem)]">
      {/* Header */}
      <header className="flex items-start justify-between gap-3 pb-4 border-b">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            {conversation && editingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setEditingTitle(false); }}
                  className="flex-1 text-sm font-semibold bg-transparent border-b border-brand outline-none"
                />
                <button onClick={saveRename} aria-label="Save title" className="p-1 text-success hover:text-success/80"><Check className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingTitle(false)} aria-label="Cancel" className="p-1 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="font-semibold truncate">
                  {conversation ? conversation.title : "AI Academic Assistant"}
                </div>
                {conversation && (
                  <button onClick={startEditTitle} aria-label="Rename conversation" className="shrink-0 p-1 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
            <div className="text-xs text-success inline-flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online and ready to help
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {conversation && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/conversations">
                <History className="h-4 w-4 mr-2" /> History
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={startNew}>
            <Plus className="h-4 w-4 mr-2" /> New
          </Button>
        </div>
      </header>

      {/* Safety notice */}
      <div className="rounded-md bg-accent/60 border mt-4 p-3 flex gap-2 text-xs text-accent-foreground">
        <Info className="h-4 w-4 shrink-0 text-brand mt-0.5" />
        <span>
          AI responses are generated using institutional information where available. Always verify
          important academic decisions with the appropriate department.
        </span>
      </div>

      {/* Messages */}
      <div ref={scroller} className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.length === 0 && <EmptyState onPick={(p) => setInput(p)} />}
        {messages.map((m) =>
          m.role === "user"
            ? <UserBubble key={m.id} msg={m} />
            : <AiBubble key={m.id} msg={m} conversationId={conversation?.id} onSuggest={send} />,
        )}
        {status !== "idle" && (
          <ThinkingBubble label={status === "searching" ? "Searching academic information…" : "Preparing your response…"} />
        )}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <div className="font-medium text-destructive">Something went wrong</div>
            <p className="mt-1 text-muted-foreground">{error}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={retry}>
                <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setError(null)}>Dismiss</Button>
            </div>
          </div>
        )}
      </div>

      <Composer input={input} setInput={setInput} onSend={() => send(input)} disabled={status !== "idle"} />
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-10">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-brand-foreground">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-semibold">How can I help you today?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ask about registration, fees, examinations, graduation, or campus services.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 text-left">
        {SAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="surface-card p-3 text-sm text-left hover:border-brand/40 transition"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: Message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-sm text-brand-foreground shadow-sm whitespace-pre-wrap">
        {msg.content}
      </div>
    </div>
  );
}

function AiBubble({
  msg,
  conversationId,
  onSuggest,
}: {
  msg: Message;
  conversationId?: string;
  onSuggest: (t: string) => void;
}) {
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(msg.feedback ?? null);

  const copy = () => { navigator.clipboard.writeText(msg.content); toast.success("Copied"); };

  const submitFeedback = async (rating: "helpful" | "not_helpful") => {
    setFeedback(rating);
    if (conversationId) {
      await feedbackService.submit({ conversationId, messageId: msg.id, rating });
      await conversationService.setFeedback(conversationId, msg.id, rating);
    }
    toast.success(rating === "helpful" ? "Thanks for the feedback!" : "We'll work to improve this.");
  };

  return (
    <div className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-brand">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] min-w-0 space-y-3">
        <div className="rounded-2xl rounded-tl-sm bg-muted/60 border px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">
          {msg.content}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.sources.map((s) => (
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
        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggest(s)}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-brand/40 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => submitFeedback("helpful")} active={feedback === "helpful"} label="Helpful">
            <ThumbsUp className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={() => submitFeedback("not_helpful")} active={feedback === "not_helpful"} label="Not helpful">
            <ThumbsDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={copy} label="Copy response">
            <Copy className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={() => toast.success("Answer saved to conversation")} label="Save answer">
            <Bookmark className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition ${
        active ? "text-brand bg-brand/10" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ThinkingBubble({ label }: { label: string }) {
  return (
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
        {label}
      </div>
    </div>
  );
}

function Composer({
  input,
  setInput,
  onSend,
  disabled,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  const max = 1000;
  const pct = input.length / max;
  return (
    <div className="border-t pt-3">
      <div className="rounded-xl border bg-card focus-within:ring-2 focus-within:ring-ring">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, max))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
          }}
          placeholder="Ask a question about registration, fees, examinations, graduation, or campus services…"
          rows={2}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm outline-none max-h-40 disabled:opacity-50"
        />
        <div className="flex items-center justify-between gap-2 px-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {input.length}/{max}
            </span>
            {input.length > 0 && (
              <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct > 0.9 ? "bg-destructive" : "bg-brand"}`}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Enter to send · Shift+Enter for new line
            </span>
          </div>
          <Button onClick={onSend} disabled={disabled || !input.trim()} size="sm">
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}
