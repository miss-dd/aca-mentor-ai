import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessagesSquare,
  History,
  HelpCircle,
  BookOpen,
  UserCircle,
  LifeBuoy,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ShieldCheck,
  Bell,
  CheckCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNotifications, markRead, markAllRead } from "@/hooks/use-notifications";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/support", label: "Ask AI", icon: MessagesSquare },
  { to: "/conversations", label: "My Conversations", icon: History },
  { to: "/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/resources", label: "Academic Resources", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/help", label: "Help & Support", icon: LifeBuoy },
] as const;

function NotificationBell() {
  const { notifications, unread } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border bg-popover shadow-elevated overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-72 overflow-y-auto divide-y">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition ${
                    n.read ? "opacity-60" : ""
                  }`}
                  onClick={() => { markRead(n.id); if (n.href) setOpen(false); }}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-brand shrink-0" />
                    )}
                    <div className={!n.read ? "" : "pl-4"}>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
                      <div className="text-[11px] text-muted-foreground/60 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {notifications.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="h-16 flex items-center justify-between gap-2 px-5 border-b">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-brand-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-semibold text-sm">AI Student Support</span>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map((item) => {
            const active =
              item.to === "/conversations"
                ? pathname.startsWith("/conversations")
                : pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
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
        </nav>
        <div className="border-t p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() ?? "S"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.studentId}</div>
            </div>
          </div>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
              <span>Admin Panel</span>
            </Link>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start mt-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
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
          <span className="text-sm font-semibold">AI Student Support</span>
        </div>
        <NotificationBell />
      </div>

      {/* Mobile drawer */}
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
                <span className="font-semibold text-sm">Menu</span>
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
              {NAV.map((item) => {
                const active =
                  item.to === "/conversations"
                    ? pathname.startsWith("/conversations")
                    : pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-3">
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <ShieldCheck className="h-4 w-4 text-brand" />
                  <span>Admin Panel</span>
                </Link>
              )}
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
