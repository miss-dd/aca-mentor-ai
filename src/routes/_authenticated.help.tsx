import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, LifeBuoy, Loader2, Shield, ActivitySquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — AI Student Support" },
      { name: "description", content: "Contact student support, report an issue, or check system status." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const [form, setForm] = useState({
    subject: "",
    category: "support",
    description: "",
    priority: "normal",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setDone(true);
    toast.success("Support request submitted");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Help & Support</h1>
        <p className="mt-1 text-muted-foreground">
          Get help from the support team or check platform status.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatusCard icon={ActivitySquare} label="Platform" value="Operational" tone="ok" />
        <StatusCard icon={Shield} label="Security" value="All systems normal" tone="ok" />
        <StatusCard icon={LifeBuoy} label="Support" value="Response ≈ 2 hrs" tone="info" />
      </div>

      <div className="surface-card p-5">
        <label className="text-sm font-medium">Search help</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search help articles…" className="pl-9" />
        </div>
      </div>

      {done ? (
        <div className="surface-card p-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-semibold">We've received your request</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The support team will reply to your institutional email.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setDone(false)}>
            Submit another
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="surface-card p-6 space-y-5">
          <h2 className="font-semibold">Contact support</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject">
              <Input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="support">General Support</option>
                <option value="account">Account</option>
                <option value="technical">Technical Issue</option>
                <option value="feedback">Feedback</option>
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Submit request
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof LifeBuoy;
  label: string;
  value: string;
  tone: "ok" | "info";
}) {
  const color = tone === "ok" ? "text-success" : "text-brand";
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-lg bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className={`text-sm font-medium ${color}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}
