'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/goals', label: 'Vision Board', icon: 'auto_awesome_motion' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar_today' },
  { href: '/focus', label: 'Focus Mode', icon: 'radio_button_unchecked' },
  { href: '/coach', label: 'AI Coach', icon: 'smart_toy' },
  { href: '/journal', label: 'Journal', icon: 'edit_note' },
  { href: '/memory', label: 'AI Memory', icon: 'psychology' },
  { href: '/ritual', label: 'Weekly Ritual', icon: 'self_improvement' },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const store = useStore();

  const activeGoals = store.goals.filter((g) => g.status === 'active').length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#060E1F]/95 backdrop-blur-xl border-r border-white/10 z-[70] flex flex-col py-6 px-4 shadow-[0px_20px_40px_rgba(15,23,41,0.6)] transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="mb-8 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <div>
              <h1 className="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5] tracking-tight">
                Lotion
              </h1>
              <p className="text-[10px] text-[#C17A72] font-['Space_Grotesk'] font-bold tracking-[0.15em] uppercase">
                AI Life Coach
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#9CA3AF] transition-colors"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const count = item.href === '/goals' ? activeGoals : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive
                    ? "relative text-[#F5F5F5] font-bold bg-white/5 before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72]"
                    : 'text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl ${
                    isActive ? 'text-[#C17A72]' : ''
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
                      isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex-shrink-0 space-y-2 pt-4 mt-4 border-t border-white/5">
          <button
            onClick={() => {
              store.autoSchedule();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#C17A72] text-[#F5F5F5] py-2.5 rounded-xl font-bold text-sm mb-3 transition-transform active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-lg">bolt</span>
            Auto-schedule
          </button>
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            Settings
          </Link>
          <Link
            href="/support"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-xl">help_outline</span>
            Support
          </Link>
        </div>
      </div>
    </>
  );
}
