import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, KeyRound, X, Eye, EyeOff } from "lucide-react";
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
  const [form, setForm] = useState({ name: "", email: "", program: "", department: "", level: "" });
  const [notifs, setNotifs] = useState({ email: true, product: false });
  const [privacy, setPrivacy] = useState({ shareHistory: false, analytics: true });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

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
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
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
        <p className="mt-1 text-muted-foreground">Manage your account information and preferences.</p>
      </header>

      {/* Avatar card */}
      <div className="surface-card p-6 flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground text-xl font-semibold">
          {user.name?.[0]?.toUpperCase() ?? "S"}
        </div>
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.studentId} · {user.email}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{user.program} · {user.level}</div>
        </div>
      </div>

      {/* Account info form */}
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
        {dirty && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t">
            <span className="text-xs text-warning">You have unsaved changes.</span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => { if (user) setForm({ name: user.name, email: user.email, program: user.program ?? "", department: user.department ?? "", level: user.level ?? "" }); setDirty(false); }}>
                Discard
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save changes
              </Button>
            </div>
          </div>
        )}
        {!dirty && (
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save changes
            </Button>
          </div>
        )}
      </form>

      {/* Notifications */}
      <div className="surface-card p-6 space-y-4">
        <h2 className="font-semibold">Notification preferences</h2>
        <ToggleRow
          label="Email notifications"
          desc="Receive important account updates by email."
          checked={notifs.email}
          onChange={(v) => { setNotifs({ ...notifs, email: v }); toast.success("Preference saved"); }}
        />
        <ToggleRow
          label="Product updates"
          desc="Occasional news and improvements from the platform."
          checked={notifs.product}
          onChange={(v) => { setNotifs({ ...notifs, product: v }); toast.success("Preference saved"); }}
        />
      </div>

      {/* Privacy */}
      <div className="surface-card p-6 space-y-4">
        <h2 className="font-semibold">Privacy</h2>
        <ToggleRow
          label="Share conversation history"
          desc="Allow anonymised conversation data to improve AI responses."
          checked={privacy.shareHistory}
          onChange={(v) => { setPrivacy({ ...privacy, shareHistory: v }); toast.success("Preference saved"); }}
        />
        <ToggleRow
          label="Usage analytics"
          desc="Help us understand how students use the platform."
          checked={privacy.analytics}
          onChange={(v) => { setPrivacy({ ...privacy, analytics: v }); toast.success("Preference saved"); }}
        />
      </div>

      {/* Security */}
      <div className="surface-card p-6 space-y-4">
        <h2 className="font-semibold">Security</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Password</div>
            <div className="text-xs text-muted-foreground">Update your password every 90 days for best security.</div>
          </div>
          <Button variant="outline" onClick={() => setShowPwModal(true)}>
            <KeyRound className="h-4 w-4 mr-2" /> Change password
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Active sessions</div>
            <div className="text-xs text-muted-foreground">You are signed in on this device.</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("All other sessions signed out")}>
            Sign out other devices
          </Button>
        </div>
      </div>

      {showPwModal && <PasswordModal onClose={() => setShowPwModal(false)} />}
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return setErr("Current password is required.");
    if (form.next.length < 8) return setErr("New password must be at least 8 characters.");
    if (form.next !== form.confirm) return setErr("Passwords do not match.");
    setErr(null);
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Password updated successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40">
      <div className="surface-card w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Change password</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Current password">
            <div className="relative">
              <Input type={show ? "text" : "password"} value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide" : "Show"} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label="New password">
            <Input type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Update password
            </Button>
          </div>
        </form>
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

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
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
