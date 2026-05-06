"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  const userInitial = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-[#060E1F]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="font-['Space_Grotesk'] font-medium text-sm text-[#C17A72] border-b-2 border-[#C17A72] pb-0.5 hover:text-[#C17A72]/80 transition-colors"
          >
            Focus Mode
          </button>
          <button
            onClick={() => router.push('/coach')}
            className="font-['Space_Grotesk'] font-medium text-sm text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors"
          >
            Insights
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl text-[#BEC6DF] hover:text-white transition-colors">
              notifications
            </span>
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#C17A72] rounded-full shadow-[0_0_8px_#C17A72]"></div>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1F2D47] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <NotificationItem
                  icon="check_circle"
                  title="Task completed"
                  message="'Build landing page' marked as done"
                  time="2 minutes ago"
                />
                <NotificationItem
                  icon="auto_awesome"
                  title="AI Insight"
                  message="You're 85% more productive in mornings"
                  time="1 hour ago"
                />
                <NotificationItem
                  icon="flag"
                  title="Deadline approaching"
                  message="'Launch MVP' due in 3 days"
                  time="3 hours ago"
                />
              </div>
              <div className="p-3 border-t border-white/10">
                <button className="w-full text-xs font-['Space_Grotesk'] text-[#C17A72] hover:text-[#C17A72]/80 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">
              {userInitial}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1F2D47] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <p className="text-sm font-['Space_Grotesk'] font-semibold text-white truncate">
                  {user?.email || "User"}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">Free Plan</p>
              </div>
              <div className="p-2">
                <ProfileMenuItem
                  icon="person"
                  label="Profile"
                  onClick={() => {
                    router.push("/settings");
                    setShowProfileMenu(false);
                  }}
                />
                <ProfileMenuItem
                  icon="settings"
                  label="Settings"
                  onClick={() => {
                    router.push("/settings");
                    setShowProfileMenu(false);
                  }}
                />
                <ProfileMenuItem
                  icon="help_outline"
                  label="Help & Support"
                  onClick={() => setShowProfileMenu(false)}
                />
              </div>
              <div className="p-2 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span className="text-sm font-['Space_Grotesk']">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NotificationItem({ icon, title, message, time }: { icon: string; title: string; message: string; time: string }) {
  return (
    <div className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#C17A72]/20 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[#C17A72] text-sm">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-['Space_Grotesk'] font-semibold text-white">{title}</p>
          <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2">{message}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="text-sm font-['Space_Grotesk']">{label}</span>
    </button>
  );
}
