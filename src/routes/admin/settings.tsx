import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [general, setGeneral] = useState({
    platformName: "AI-Powered Student Support System",
    institutionName: "Institution Name",
    supportEmail: "support@institution.edu",
    aiDisclaimer:
      "AI-generated responses are intended to provide academic guidance and may not replace official institutional decisions. Verify important information with the appropriate department.",
  });
  const [features, setFeatures] = useState({
    feedbackEnabled: true,
    conversationHistory: true,
    resourceDownloads: true,
    adminAnalytics: true,
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure platform behaviour and feature flags.
        </p>
      </header>

      <form onSubmit={save} className="space-y-6">
        {/* General */}
        <div className="surface-card p-6 space-y-5">
          <h2 className="font-semibold">General</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Platform Name">
              <Input
                value={general.platformName}
                onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
              />
            </Field>
            <Field label="Institution Name">
              <Input
                value={general.institutionName}
                onChange={(e) => setGeneral({ ...general, institutionName: e.target.value })}
              />
            </Field>
            <Field label="Support Email">
              <Input
                type="email"
                value={general.supportEmail}
                onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
              />
            </Field>
          </div>
          <Field label="AI Safety Disclaimer">
            <Textarea
              rows={3}
              value={general.aiDisclaimer}
              onChange={(e) => setGeneral({ ...general, aiDisclaimer: e.target.value })}
            />
          </Field>
        </div>

        {/* Feature flags */}
        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Feature Flags</h2>
          <ToggleRow
            label="Student Feedback"
            desc="Allow students to rate AI responses as helpful or not helpful."
            checked={features.feedbackEnabled}
            onChange={(v) => setFeatures({ ...features, feedbackEnabled: v })}
          />
          <ToggleRow
            label="Conversation History"
            desc="Save and display student conversation history."
            checked={features.conversationHistory}
            onChange={(v) => setFeatures({ ...features, conversationHistory: v })}
          />
          <ToggleRow
            label="Resource Downloads"
            desc="Allow students to request document download URLs."
            checked={features.resourceDownloads}
            onChange={(v) => setFeatures({ ...features, resourceDownloads: v })}
          />
          <ToggleRow
            label="Admin Analytics"
            desc="Enable the analytics dashboard for administrators."
            checked={features.adminAnalytics}
            onChange={(v) => setFeatures({ ...features, adminAnalytics: v })}
          />
        </div>

        {/* API integration note */}
        <div className="surface-card p-5 bg-accent/40">
          <h2 className="font-semibold text-sm">Backend Integration</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set <code className="rounded bg-muted px-1 py-0.5 text-xs">VITE_PUBLIC_API_BASE_URL</code> in
            your environment to route all service calls to your Amazon API Gateway endpoint. The mock
            service layer will be bypassed automatically.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
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

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
