"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/goals", label: "Goals", icon: GoalsIcon },
  { href: "/tasks", label: "Tasks", icon: TasksIcon },
  { href: "/coach", label: "AI Coach", icon: CoachIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const store = useStore();

  const activeGoals = store.goals.filter((g) => g.status === "active").length;
  const activeTasks = store.tasks.filter((t) => !t.completed).length;

  return (
    <aside
      className="w-60 h-screen flex flex-col shrink-0 border-r"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/calendar" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-glow)", border: "1px solid rgba(139, 92, 246, 0.3)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}
          >
            Motion
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const count =
            item.href === "/goals" ? activeGoals :
            item.href === "/tasks" ? activeTasks : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: isActive ? "var(--accent-soft)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <item.icon active={isActive} />
              <span className="flex-1">{item.label}</span>
              {count > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-md"
                  style={{
                    background: isActive ? "rgba(139, 92, 246, 0.15)" : "rgba(255,255,255,0.05)",
                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auto-schedule */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => store.autoSchedule()}
          className="w-full btn-glow flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.7 }}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function GoalsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.7 }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TasksIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.7 }}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function CoachIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.7 }}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
