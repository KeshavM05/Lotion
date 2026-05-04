"use client";

export function Header() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-transparent flex justify-between items-center px-8">
      <div className="flex items-center gap-8">
        <nav className="flex gap-6">
          <a
            href="#"
            className="font-body font-medium text-sm text-[#C17A72] border-b border-[#C17A72] pb-1"
          >
            Focus Mode
          </a>
          <a
            href="#"
            className="font-body font-medium text-sm text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
          >
            Insights
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <span className="material-symbols-outlined text-[#BEC6DF] opacity-80 hover:opacity-100 transition-opacity">
            notifications
          </span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full shadow-[0_0_8px_rgba(255,180,171,0.6)]"></div>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">
          K
        </div>
      </div>
    </header>
  );
}
