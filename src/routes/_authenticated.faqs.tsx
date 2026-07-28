import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/mock-data";
import { faqService } from "@/services/faq.service";
import type { FAQ, Category } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — AI Student Support" },
      { name: "description", content: "Frequently asked academic questions and answers." },
    ],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");

  useEffect(() => {
    faqService.list().then((r) => r.success && setFaqs(r.data));
  }, []);

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Quick answers to the most common student questions.
        </p>
      </header>

      <div className="surface-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            All
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
              {CATEGORY_LABEL[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No matches</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search, or ask the AI assistant directly.
          </p>
          <Button asChild className="mt-4">
            <Link to="/support">Ask the AI Assistant</Link>
          </Button>
        </div>
      ) : (
        <div className="surface-card p-2">
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="px-2">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{f.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{f.answer}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {CATEGORY_LABEL[f.category]}
                    </span>
                    <span>Updated {f.updatedAt}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span>Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Helpful"
                        onClick={() => toast.success("Thanks for your feedback")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Not helpful"
                        asChild
                      >
                        <Link to="/support">
                          <ThumbsDown className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "bg-brand text-brand-foreground border-brand"
          : "bg-background text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
