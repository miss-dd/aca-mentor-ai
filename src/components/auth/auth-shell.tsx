import { Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 text-brand-foreground gradient-brand">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-semibold">AI Student Support</span>
        </Link>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Academic support that never sleeps.
          </h2>
          <p className="mt-3 text-brand-foreground/80 max-w-md">
            Get consistent, sourced answers to your academic questions — from registration to
            graduation.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-brand-foreground/85">
            <ShieldCheck className="h-4 w-4" /> Secure access powered by institutional authentication.
          </div>
        </div>
        <div className="text-xs text-brand-foreground/70">
          © 2026 AI-Powered Student Support System
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-brand-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-semibold text-sm">AI Student Support</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
