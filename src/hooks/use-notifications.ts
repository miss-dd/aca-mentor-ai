import { useState, useEffect, useCallback } from "react";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

// In-memory store — replace with API calls when backend is ready
const INITIAL: AppNotification[] = [
  {
    id: "n1",
    title: "New FAQ published",
    body: "A new FAQ about graduation requirements has been added.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    href: "/faqs",
  },
  {
    id: "n2",
    title: "Resource available",
    body: "The 2025/2026 Academic Calendar PDF is now available for download.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    href: "/resources",
  },
  {
    id: "n3",
    title: "System maintenance",
    body: "Scheduled maintenance on Sunday 02:00–04:00 UTC. Brief downtime expected.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let _store: AppNotification[] = [...INITIAL];
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

export function markRead(id: string) {
  _store = _store.map((n) => (n.id === id ? { ...n, read: true } : n));
  notify();
}

export function markAllRead() {
  _store = _store.map((n) => ({ ...n, read: true }));
  notify();
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(_store);

  const sync = useCallback(() => setNotifications([..._store]), []);

  useEffect(() => {
    _listeners.add(sync);
    return () => { _listeners.delete(sync); };
  }, [sync]);

  const unread = notifications.filter((n) => !n.read).length;
  return { notifications, unread, markRead, markAllRead };
}
