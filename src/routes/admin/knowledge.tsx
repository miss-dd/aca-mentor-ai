import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, FileText, Upload, Archive, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { CATEGORY_LABEL, CATEGORIES } from "@/lib/mock-data";
import type { KnowledgeDoc, Category } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — Admin" }] }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all");
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    adminService.listDocs().then((r) => {
      if (r.success) setDocs(r.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = docs;
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    if (category !== "all") list = list.filter((d) => d.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [docs, query, category, statusFilter]);

  const archive = async (id: string) => {
    const r = await adminService.archiveDoc(id);
    if (r.success) { toast.success("Document archived"); load(); }
  };

  const remove = async (id: string) => {
    const r = await adminService.deleteDoc(id);
    if (r.success) { toast.success("Document deleted"); load(); }
  };

  const simulateUpload = async () => {
    setUploading(true);
    const r = await adminService.requestUploadUrl("new-document.pdf");
    setUploading(false);
    if (r.success) toast.success("Upload URL prepared (mock). Connect to backend to complete upload.");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Knowledge Base</h1>
          <p className="mt-1 text-muted-foreground">
            Manage documents used to generate AI responses.
          </p>
        </div>
        <Button onClick={simulateUpload} disabled={uploading}>
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Preparing…
            </span>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" /> Upload Document
            </>
          )}
        </Button>
      </header>

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents…"
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
            <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "archived")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="surface-card h-40 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No documents found</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload a document to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="surface-card p-5 flex flex-col">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase text-muted-foreground">{doc.fileType}</span>
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      doc.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
              <h2 className="mt-3 font-semibold text-sm">{doc.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground flex-1">{doc.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5">
                  {CATEGORY_LABEL[doc.category]}
                </span>
                <span>{doc.size}</span>
                <span>Updated {doc.updatedAt}</span>
              </div>
              <div className="mt-4 flex gap-2">
                {doc.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => archive(doc.id)}
                  >
                    <Archive className="h-3.5 w-3.5 mr-1.5" /> Archive
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => remove(doc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
