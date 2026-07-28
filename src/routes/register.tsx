import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — AI Student Support" },
      { name: "description", content: "Create a student account for AI-powered academic support." },
    ],
  }),
  component: RegisterPage,
});

function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => passwordScore(form.password), [form.password]);
  const scoreLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][score];
  const scoreColor = ["bg-destructive", "bg-destructive", "bg-warning", "bg-brand", "bg-success"][score];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name) next.name = "Full name is required.";
    if (!form.studentId) next.studentId = "Student ID is required.";
    if (!form.email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 8) next.password = "Minimum 8 characters.";
    if (form.password !== form.confirm) next.confirm = "Passwords do not match.";
    if (!form.terms) next.terms = "You must accept the terms.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        studentId: form.studentId,
        password: form.password,
      });
      toast.success("Account created");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your student account"
      subtitle="Get instant answers to your academic questions."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" error={errors.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Student ID" error={errors.studentId}>
            <Input value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          </Field>
          <Field label="Institutional email" error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
        </div>
        <Field label="Password" error={errors.password}>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {form.password && (
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${scoreColor}`} style={{ width: `${(score / 4) * 100}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Strength: {scoreLabel}</p>
            </div>
          )}
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </Field>
        <div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox checked={form.terms} onCheckedChange={(v) => setForm({ ...form, terms: !!v })} className="mt-0.5" />
            <span>
              I agree to the <a href="#" className="text-brand hover:underline">Terms of Use</a> and{" "}
              <a href="#" className="text-brand hover:underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-destructive">{errors.terms}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
