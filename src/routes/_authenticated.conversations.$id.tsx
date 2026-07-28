import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Copy, MessageSquare, Sparkles, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { conversationService } from "@/services/conversation.service";
import { CATEGORY_LABEL } from "@/lib/mock-data";
import type { Conversation } from "@/types";
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

  useEffect(() => {
    conversationService.get(id).then((r) => {
      if (r.success) setConv(r.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="surface-card p-6 animate-pulse h-64" />;
  }
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

  const remove = async () => {
    await conversationService.remove(conv.id);
    toast.success("Deleted");
    navigate({ to: "/conversations" });
  };
  const save = async () => {
    await conversationService.toggleSave(conv.id);
    const r = await conversationService.get(conv.id);
    if (r.success) setConv(r.data);
    toast.success("Updated");
  };
  const copyAll = () => {
    const text = conv.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Conversation copied");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
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
            <Bookmark className={`h-4 w-4 mr-2 ${conv.saved ? "text-brand fill-brand" : ""}`} /> {conv.saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" onClick={remove}>
            <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Delete
          </Button>
        </div>
      </div>

      <header className="surface-card p-5">
        <h1 className="text-xl font-semibold">{conv.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5">{CATEGORY_LABEL[conv.category]}</span>
          <span>{new Date(conv.updatedAt).toLocaleString()}</span>
        </div>
      </header>

      <div className="space-y-4">
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
                <div className="rounded-2xl rounded-tl-sm bg-muted/60 border px-4 py-3 text-sm whitespace-pre-wrap">
                  {m.content}
                </div>
                {m.sources && (
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s) => (
                      <span
                        key={s.title}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        <BookOpen className="h-3 w-3 text-brand" /> {s.title} · {s.reference}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="border-t pt-4">
        <Button asChild>
          <Link to="/support">Continue in a new question</Link>
        </Button>
      </div>
    </div>
  );
}
