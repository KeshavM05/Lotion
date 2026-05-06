"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/goals", label: "Vision Board", icon: "auto_awesome_motion" },
  { href: "/calendar", label: "Calendar", icon: "calendar_today" },
  { href: "/coach", label: "AI Coach", icon: "smart_toy" },
  { href: "/journal", label: "Journal", icon: "edit_note" },
  { href: "/tasks", label: "Tasks", icon: "check_circle" },
  { href: "/memory", label: "AI Memory", icon: "psychology" },
];

export function Sidebar() {
  const pathname = usePathname();
  const store = useStore();

  const activeGoals = store.goals.filter((g) => g.status === "active").length;
  const activeTasks = store.tasks.filter((t) => !t.completed).length;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col py-6 px-4 shadow-[0px_20px_40px_rgba(15,23,41,0.4)]">
      {/* Logo */}
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-serif italic text-[#F5F5F5]">Lotion</h1>
        <p className="text-xs text-[#9CA3AF] font-body tracking-[0.2em] uppercase mt-1">
          AI Coach
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? "relative text-[#F5F5F5] font-bold bg-white/5 before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72]"
                  : "text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isActive ? "text-[#C17A72]" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="font-['Space_Grotesk'] text-sm tracking-wide flex-1">
                {item.label}
              </span>
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auto-schedule & Bottom Actions */}
      <div className="flex-shrink-0 space-y-2 pt-4 mt-4 border-t border-white/5">
        <button
          onClick={() => store.autoSchedule()}
          className="w-full flex items-center justify-center gap-2 bg-[#C17A72] text-[#F5F5F5] py-2.5 rounded-xl font-bold text-sm mb-3 transition-transform active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-lg">bolt</span>
          Auto-schedule
        </button>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          Settings
        </Link>
        <Link
          href="/support"
          className="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
          Support
        </Link>
      </div>
    </aside>
  );
}
