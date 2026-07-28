import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  HelpCircle,
  ThumbsUp,
  BarChart2,
  Users,
  Activity,
  Settings,
  GraduationCap,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/queries", label: "Student Queries", icon: MessageSquare },
  { to: "/admin/knowledge", label: "Knowledge Base", icon: Database },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/feedback", label: "Feedback", icon: ThumbsUp },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/monitoring", label: "Monitoring", icon: Activity },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <>
      {NAV.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-dvh bg-background">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="h-16 flex items-center gap-2 px-5 border-b">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-brand-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">AI Student Support</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-brand" /> Admin
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavLinks />
        </nav>
        <div className="border-t p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">Administrator</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start mt-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background px-4">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md gradient-brand text-brand-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">Admin Panel</span>
        </div>
        <div className="w-10" />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-sidebar text-sidebar-foreground flex flex-col shadow-xl">
            <div className="h-16 flex items-center justify-between px-5 border-b">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-brand-foreground">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <span className="font-semibold text-sm">Admin Panel</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              <NavLinks onClose={() => setMobileOpen(false)} />
            </nav>
            <div className="border-t p-3">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="container-page py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
