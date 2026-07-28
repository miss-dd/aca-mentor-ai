import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — AI Student Support" },
      { name: "description", content: "Manage your student profile, preferences, and security." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    program: "",
    department: "",
    level: "",
  });
  const [notifs, setNotifs] = useState({ email: true, product: false });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user)
      setForm({
        name: user.name,
        email: user.email,
        program: user.program ?? "",
        department: user.department ?? "",
        level: user.level ?? "",
      });
  }, [user]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateProfile(form);
    setSaving(false);
    setDirty(false);
    toast.success("Profile updated");
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </header>

      <div className="surface-card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-brand text-brand-foreground text-xl font-semibold">
            {user.name?.[0]?.toUpperCase() ?? "S"}
          </div>
          <div>
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              {user.studentId} · {user.email}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={save} className="surface-card p-6 space-y-5" onChange={() => setDirty(true)}>
        <h2 className="font-semibold">Account information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Institutional email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Program">
            <Input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} />
          </Field>
          <Field label="Department">
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </Field>
          <Field label="Academic level">
            <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save changes
          </Button>
        </div>
      </form>

      <div className="surface-card p-6 space-y-4">
        <h2 className="font-semibold">Notification preferences</h2>
        <ToggleRow
          label="Email notifications"
          desc="Receive important account updates by email."
          checked={notifs.email}
          onChange={(v) => setNotifs({ ...notifs, email: v })}
        />
        <ToggleRow
          label="Product updates"
          desc="Occasional news and improvements from the platform."
          checked={notifs.product}
          onChange={(v) => setNotifs({ ...notifs, product: v })}
        />
      </div>

      <div className="surface-card p-6 space-y-4">
        <h2 className="font-semibold">Security</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Change password</div>
            <div className="text-xs text-muted-foreground">
              Update your password every 90 days for best security.
            </div>
          </div>
          <Button variant="outline">Change password</Button>
        </div>
      </div>
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
