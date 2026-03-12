"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/calendar", label: "Calendar", icon: CalendarIcon, countKey: null },
  { href: "/tasks", label: "Tasks", icon: TasksIcon, countKey: "tasks" as const },
  { href: "/projects", label: "Projects", icon: ProjectsIcon, countKey: "projects" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const store = useStore();

  const counts = {
    tasks: store.tasks.filter((t) => !t.completed).length,
    projects: store.projects.length,
  };

  return (
    <aside className="w-60 h-screen bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col shrink-0">
      <div className="p-4 border-b border-[var(--border)]">
        <h1 className="text-xl font-bold">Motion</h1>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const count = item.countKey ? counts[item.countKey] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
              }`}
            >
              <item.icon />
              <span className="flex-1">{item.label}</span>
              {item.countKey && count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20" : "bg-[var(--accent)]"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auto-schedule button */}
      <div className="p-3 border-t border-[var(--border)]">
        <button
          onClick={() => store.autoSchedule()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 6v6l4 2" />
            <path d="M16 2l4 4-4 4" />
          </svg>
          Auto-schedule
        </button>
      </div>
    </aside>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 002 2h16a2 2 0 002-2V8l-7-6H4a2 2 0 00-2 2v16z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
