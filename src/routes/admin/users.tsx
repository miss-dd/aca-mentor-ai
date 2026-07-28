import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import type { AdminUser } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  const load = () => {
    setLoading(true);
    adminService.listUsers().then((r) => {
      if (r.success) setUsers(r.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.studentId ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [users, query, roleFilter, statusFilter]);

  const toggleStatus = async (u: AdminUser) => {
    const next = u.status === "active" ? "suspended" : "active";
    const r = await adminService.updateUserStatus(u.id, next);
    if (r.success) {
      toast.success(`User ${next}`);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-muted-foreground">
          Manage student and administrator accounts.
        </p>
      </header>

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or student ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "all" | "student" | "admin")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "suspended")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="surface-card h-16 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-8 text-center text-sm text-muted-foreground">
          No users match your filters.
        </div>
      ) : (
        <div className="surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Last Login
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground text-xs font-medium">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        {u.studentId && (
                          <div className="text-xs text-muted-foreground">{u.studentId}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-brand/10 text-brand"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(u)}
                      className="text-xs"
                    >
                      {u.status === "active" ? (
                        <><UserX className="h-3.5 w-3.5 mr-1.5 text-destructive" /> Suspend</>
                      ) : (
                        <><UserCheck className="h-3.5 w-3.5 mr-1.5 text-success" /> Activate</>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
