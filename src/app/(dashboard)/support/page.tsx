"use client";

export default function SupportPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="mb-12">
        <h2 className="text-5xl font-['Playfair_Display'] text-[#F5F5F5] mb-2">Help & Support</h2>
        <p className="text-on-secondary-container font-['Space_Grotesk'] tracking-wide">
          Get help with Lotion or contact our support team
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <SupportCard
          icon="book"
          title="Documentation"
          description="Learn how to use all features of Lotion"
          link="#"
        />
        <SupportCard
          icon="video_library"
          title="Video Tutorials"
          description="Watch step-by-step guides"
          link="#"
        />
        <SupportCard
          icon="forum"
          title="Community Forum"
          description="Connect with other Lotion users"
          link="#"
        />
        <SupportCard
          icon="bug_report"
          title="Report a Bug"
          description="Help us improve Lotion"
          link="#"
        />
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-['Playfair_Display'] text-white mb-6">Contact Support</h3>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-2">Subject</label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72]"
            />
          </div>
          <div>
            <label className="block text-sm font-['Space_Grotesk'] text-[#BEC6DF] mb-2">Message</label>
            <textarea
              rows={6}
              placeholder="Describe your issue or question in detail"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['Space_Grotesk'] text-sm focus:outline-none focus:border-[#C17A72] resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#C17A72] hover:bg-[#C17A72]/90 text-white rounded-lg font-['Space_Grotesk'] text-sm font-semibold transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

function SupportCard({ icon, title, description, link }: { icon: string; title: string; description: string; link: string }) {
  return (
    <a
      href={link}
      className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-[#C17A72]/20 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[#C17A72] text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-['Playfair_Display'] text-white mb-2 group-hover:text-[#C17A72] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#9CA3AF]">{description}</p>
    </a>
  );
}
