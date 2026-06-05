'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useSidebar } from '@/lib/sidebar-context';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/goals', label: 'Vision Board', icon: 'auto_awesome_motion' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar_today' },
  { href: '/focus', label: 'Focus Mode', icon: 'radio_button_unchecked' },
  { href: '/coach', label: 'AI Coach', icon: 'smart_toy' },
  { href: '/journal', label: 'Journal', icon: 'edit_note' },
  { href: '/memory', label: 'AI Memory', icon: 'psychology' },
  { href: '/ritual', label: 'Weekly Ritual', icon: 'self_improvement' },
  { href: '/analytics', label: 'Analytics', icon: 'bar_chart' },
];

export function Sidebar() {
  const pathname = usePathname();
  const store = useStore();
  const { collapsed, setCollapsed } = useSidebar();

  const activeGoals = store.goals.filter((g) => g.status === 'active').length;

  return (
    <aside
      className={`flex-shrink-0 h-screen sticky top-0 ${collapsed ? 'w-20' : 'w-64'} bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col py-6 px-4 shadow-[0px_20px_40px_rgba(15,23,41,0.4)] transition-all duration-300`}
    >
      {/* Logo */}
      <div className="mb-10 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(193,122,114,0.3)]">
              <span
                className="material-symbols-outlined text-white text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                smart_toy
              </span>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C17A72] rounded-full animate-pulse"></div>
          </div>
          {!collapsed && (
            <h1 className="text-3xl font-['Playfair_Display'] italic text-[#F5F5F5] tracking-tight">
              Lotion
            </h1>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2 ml-[52px]">
            <div className="h-px flex-1 bg-gradient-to-r from-[#C17A72]/50 to-transparent"></div>
            <p className="text-[10px] text-[#C17A72] font-['Space_Grotesk'] font-bold tracking-[0.15em] uppercase">
              AI Life Coach
            </p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 w-full flex items-center justify-center py-2 rounded-lg hover:bg-white/5 text-[#9CA3AF] transition-colors"
      >
        <span className="material-symbols-outlined text-lg">
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const count = item.href === '/goals' ? activeGoals : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? "relative text-[#F5F5F5] font-bold bg-white/5 before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72]"
                  : 'text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5'
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${isActive ? 'text-[#C17A72]' : ''}`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="font-['Space_Grotesk'] text-sm tracking-wide flex-1">
                    {item.label}
                  </span>
                  {count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auto-schedule & Bottom Actions */}
      <div className="flex-shrink-0 space-y-2 pt-4 mt-4 border-t border-white/5">
        <button
          onClick={() => store.autoSchedule()}
          title={collapsed ? 'Auto-schedule' : undefined}
          className={`w-full flex items-center justify-center ${collapsed ? '' : 'gap-2'} bg-[#C17A72] text-[#F5F5F5] py-2.5 rounded-xl font-bold text-sm mb-3 transition-transform active:scale-95 duration-200`}
        >
          <span className="material-symbols-outlined text-lg">bolt</span>
          {!collapsed && 'Auto-schedule'}
        </button>
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm`}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          {!collapsed && 'Settings'}
        </Link>
        <Link
          href="/support"
          title={collapsed ? 'Support' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm`}
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
          {!collapsed && 'Support'}
        </Link>
      </div>
    </aside>
  );
}
