import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — AI Student Support" },
      { name: "description", content: "Set a new password for your student account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setErr("Minimum 8 characters.");
    if (pw !== confirm) return setErr("Passwords do not match.");
    setErr(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Password updated");
    navigate({ to: "/login" });
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password with at least 8 characters."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" className="mt-1.5" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cf">Confirm password</Label>
          <Input id="cf" type="password" className="mt-1.5" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
          <li>At least 8 characters</li>
          <li>Mix uppercase, numbers, and symbols for a stronger password</li>
        </ul>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </AuthShell>
  );
}
