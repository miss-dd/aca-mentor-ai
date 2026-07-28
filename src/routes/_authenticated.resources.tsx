import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourceService } from "@/services/resource.service";
import { CATEGORY_LABEL, CATEGORIES } from "@/lib/mock-data";
import type { Resource, Category } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/resources")({
  head: () => ({
    meta: [
      { title: "Academic Resources — AI Student Support" },
      { name: "description", content: "Approved academic resources and guides." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");

  useEffect(() => {
    resourceService.list().then((r) => {
      if (r.success) setItems(r.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (cat !== "all") list = list.filter((r) => r.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, query, cat]);

  const download = async (r: Resource) => {
    const res = await resourceService.requestDownloadUrl(r.id);
    if (res.success) toast.success(`Download prepared: ${r.title}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Academic Resources</h1>
        <p className="mt-1 text-muted-foreground">Approved handbooks, guides, and reference materials.</p>
      </header>

      <div className="surface-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources…"
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="surface-card h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No resources found</h2>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div key={r.id} className="surface-card p-5 flex flex-col hover:shadow-elevated transition-shadow">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {r.fileType}
                </span>
              </div>
              <h2 className="mt-4 font-semibold">{r.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground flex-1">{r.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5">{CATEGORY_LABEL[r.category]}</span>
                <span>Updated {r.updatedAt}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" /> View
                </Button>
                <Button size="sm" className="flex-1" onClick={() => download(r)}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
