import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resourceService } from "@/services/resource.service";
import { CATEGORY_LABEL } from "@/lib/mock-data";
import type { Resource } from "@/types";
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
  useEffect(() => {
    resourceService.list().then((r) => r.success && setItems(r.data));
  }, []);

  const download = async (r: Resource) => {
    const res = await resourceService.requestDownloadUrl(r.id);
    if (res.success) toast.success(`Prepared: ${r.title}`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Academic Resources</h1>
        <p className="mt-1 text-muted-foreground">
          Approved handbooks, guides, and reference materials.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <div key={r.id} className="surface-card p-5 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xs uppercase text-muted-foreground">{r.fileType}</span>
            </div>
            <h2 className="mt-4 font-semibold">{r.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground flex-1">{r.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5">
                {CATEGORY_LABEL[r.category]}
              </span>
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
    </div>
  );
}
