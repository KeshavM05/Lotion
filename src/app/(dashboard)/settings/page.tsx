"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import {
  exportGoalsMarkdown,
  exportJournalMarkdown,
  exportAllJSON,
  exportTasksCSV,
  exportCalendarJSON,
  exportPDF,
  downloadFile,
} from "@/lib/export";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "export" | "about"
  >("profile");
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-12">
        <h2 className="text-5xl font-['Playfair_Display'] text-[#F5F5F5] mb-2">
          Settings
        </h2>
        <p className="text-on-secondary-container font-['Space_Grotesk'] tracking-wide">
          Manage your account and preferences
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Tabs */}
        <div className="col-span-3">
          <div className="glass-card p-4 rounded-2xl space-y-2">
            <TabButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              icon="person"
              label="Profile"
            />
            <TabButton
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
              icon="tune"
              label="Preferences"
            />
            <TabButton
              active={activeTab === "export"}
              onClick={() => setActiveTab("export")}
              icon="download"
              label="Export Data"
            />
            <TabButton
              active={activeTab === "about"}
              onClick={() => setActiveTab("about")}
              icon="info"
              label="About"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-9">
          <div className="glass-card p-8 rounded-2xl">
            {activeTab === "profile" && (
              <ProfileSection
                user={user}
                onSignOut={handleSignOut}
                loading={loading}
              />
            )}
            {activeTab === "preferences" && <PreferencesSection />}
            {activeTab === "export" && <ExportSection />}
            {activeTab === "about" && <AboutSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
        active
          ? "bg-white/10 text-[#F5F5F5] border-l-2 border-l-[#C17A72]"
          : "text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5"
      }`}
    >
      <span
        className={`material-symbols-outlined text-xl ${active ? "text-[#C17A72]" : ""}`}
      >
        {icon}
      </span>
      <span className="font-['Space_Grotesk'] text-sm">{label}</span>
    </button>
  );
}

function ProfileSection({
  user,
  onSignOut,
  loading,
}: {
  user: unknown;
  onSignOut: () => void;
  loading: boolean;
}) {
  const u = user as { email?: string } | null;
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-['Playfair_Display'] text-white mb-6">
          Profile
        </h3>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-white/10 bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center text-2xl font-bold text-white">
              {u?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-['Space_Grotesk'] transition-colors">
                Change Avatar
              </button>
              <p className="text-xs text-[#9CA3AF] mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-2">
              Email
            </label>
            <input
              type="email"
              value={u?.email ?? ""}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm"
            />
            <p className="text-xs text-[#9CA3AF] mt-2">
              Your email cannot be changed
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-2">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72]"
            />
          </div>

          {/* Save Changes */}
          <button className="px-6 py-3 bg-[#C17A72] hover:bg-[#C17A72]/90 text-white rounded-lg font-['Space_Grotesk'] text-sm font-semibold transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8">
        <h4 className="text-lg font-['Playfair_Display'] text-white mb-4">
          Danger Zone
        </h4>
        <button
          onClick={onSignOut}
          disabled={loading}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-['Space_Grotesk'] text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}

function PreferencesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-['Playfair_Display'] text-white mb-6">
          Preferences
        </h3>

        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <h4 className="text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-4">
              Notifications
            </h4>
            <div className="space-y-3">
              <ToggleOption
                label="Email notifications"
                description="Receive email updates about your goals"
              />
              <ToggleOption
                label="Task reminders"
                description="Get reminded about upcoming deadlines"
              />
              <ToggleOption
                label="Weekly summary"
                description="Weekly report of your progress"
              />
            </div>
          </div>

          {/* Work Hours */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-4">
              Work Hours
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  defaultValue="18:00"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72]"
                />
              </div>
            </div>
          </div>

          {/* Calendar Settings */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-4">
              Calendar Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-2">
                  Time Format
                </label>
                <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72] cursor-pointer">
                  <option value="12h">12-hour (9:00 AM)</option>
                  <option value="24h">24-hour (09:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-2">
                  Week Start Day
                </label>
                <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72] cursor-pointer">
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-2">
                  Default Event Duration
                </label>
                <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72] cursor-pointer">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-2">
                  Time Slot Interval
                </label>
                <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72] cursor-pointer">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auto-schedule Settings */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-4">
              Auto-schedule
            </h4>
            <div className="space-y-3">
              <ToggleOption
                label="Auto-decline conflicts"
                description="Automatically decline meetings that conflict with existing events"
              />
              <ToggleOption
                label="Smart buffer time"
                description="Add 5-minute buffers between back-to-back meetings"
              />
              <ToggleOption
                label="Respect work hours"
                description="Only schedule tasks within your configured work hours"
              />
            </div>
          </div>

          {/* Calendar Integration */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-4">
              Calendar Integration
            </h4>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#C17A72]">
                    calendar_today
                  </span>
                  <span>Connect Google Calendar</span>
                </div>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#C17A72]">
                    event
                  </span>
                  <span>Connect Outlook</span>
                </div>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportSection() {
  const {
    goals,
    milestones,
    tasks,
    taskLists,
    events,
    chatMessages,
    journalEntries,
    aiMemory,
  } = useStore();
  const slug = new Date().toISOString().split("T")[0];

  const handleMarkdownExport = async () => {
    try {
      const goalsContent = exportGoalsMarkdown(goals, milestones, tasks);
      const journalContent = exportJournalMarkdown(journalEntries, goals);
      const combined = goalsContent + "\n\n" + journalContent;
      downloadFile(
        combined,
        `lotion-export-${slug}.md`,
        "text/markdown"
      );
      toast.success("Markdown export downloaded");
    } catch {
      toast.error("Failed to export Markdown");
    }
  };

  const handleJSONExport = async () => {
    try {
      const content = exportAllJSON({
        goals,
        milestones,
        tasks,
        events,
        chatMessages,
        journalEntries,
        aiMemory,
      });
      downloadFile(
        content,
        `lotion-export-${slug}.json`,
        "application/json"
      );
      toast.success("JSON export downloaded");
    } catch {
      toast.error("Failed to export JSON");
    }
  };

  const handleCSVExport = async () => {
    try {
      const content = exportTasksCSV(tasks, taskLists, goals);
      downloadFile(
        content,
        `lotion-tasks-${slug}.csv`,
        "text/csv;charset=utf-8;"
      );
      toast.success("Tasks CSV downloaded");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleCalendarExport = async () => {
    try {
      const content = exportCalendarJSON(events);
      downloadFile(
        content,
        `lotion-calendar-${slug}.json`,
        "application/json"
      );
      toast.success("Calendar JSON downloaded");
    } catch {
      toast.error("Failed to export calendar");
    }
  };

  const handlePDFExport = async () => {
    try {
      exportPDF({ goals, milestones, tasks, journalEntries, aiMemory });
      toast.success("Print dialog opened — save as PDF");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to open print view", { description: msg });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-['Playfair_Display'] text-white mb-6">
          Export Data
        </h3>
        <p className="text-sm text-[#9CA3AF] mb-8">
          Download your data in various formats. All exports include your goals,
          tasks, journal entries, and AI memory.
        </p>

        <div className="space-y-4">
          <ExportButton
            icon="description"
            title="Export as Markdown"
            description="Goals, milestones, tasks, and journal — human-readable"
            format=".md"
            onClick={handleMarkdownExport}
          />
          <ExportButton
            icon="code"
            title="Export as JSON"
            description="Complete data dump — goals, tasks, events, chat, journal"
            format=".json"
            onClick={handleJSONExport}
          />
          <ExportButton
            icon="table_chart"
            title="Export Tasks as CSV"
            description="Spreadsheet-friendly — title, status, priority, due date, list"
            format=".csv"
            onClick={handleCSVExport}
          />
          <ExportButton
            icon="calendar_month"
            title="Export Calendar as JSON"
            description="All calendar events with recurrence and source info"
            format=".json"
            onClick={handleCalendarExport}
          />
          <ExportButton
            icon="picture_as_pdf"
            title="Export as PDF"
            description="Formatted printable document — opens browser print dialog"
            format="PDF"
            onClick={handlePDFExport}
          />
        </div>
      </div>
    </div>
  );
}

function ExportButton({
  icon,
  title,
  description,
  format,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  format: string;
  onClick: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#C17A72]/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#C17A72]">
            {icon}
          </span>
        </div>
        <div className="text-left">
          <p className="text-sm font-['Space_Grotesk'] font-semibold text-white group-hover:text-[#C17A72] transition-colors">
            {title}
          </p>
          <p className="text-xs text-[#9CA3AF]">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-['JetBrains_Mono'] text-[#9CA3AF]">
          {format}
        </span>
        {loading ? (
          <span className="material-symbols-outlined text-[#9CA3AF] animate-spin">
            progress_activity
          </span>
        ) : (
          <span className="material-symbols-outlined text-[#9CA3AF] group-hover:text-white transition-colors">
            download
          </span>
        )}
      </div>
    </button>
  );
}

function AboutSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-['Playfair_Display'] text-white mb-6">
          About Lotion
        </h3>
        <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
          Lotion is your AI life coach - combining calendar management, goal
          tracking, and personalized AI guidance to help you achieve what
          matters most.
        </p>

        <div className="space-y-4">
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow label="Build" value="2026.05.06" />
          <InfoRow label="License" value="MIT" />
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <h4 className="text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-4">
            Resources
          </h4>
          <div className="space-y-3">
            <LinkButton href="#" label="Documentation" icon="book" />
            <LinkButton href="#" label="Privacy Policy" icon="shield" />
            <LinkButton href="#" label="Terms of Service" icon="gavel" />
            <LinkButton href="#" label="Contact Support" icon="support_agent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white font-['Space_Grotesk']">{label}</p>
        <p className="text-xs text-[#9CA3AF]">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-[#C17A72]" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#9CA3AF]">{label}</span>
      <span className="text-sm font-['JetBrains_Mono'] text-white">{value}</span>
    </div>
  );
}

function LinkButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#C17A72]">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="material-symbols-outlined text-[#9CA3AF] group-hover:text-white transition-colors">
        arrow_forward
      </span>
    </a>
  );
}
