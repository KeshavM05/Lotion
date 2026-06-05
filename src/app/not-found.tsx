import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#0F1729" }}
    >
      <div className="max-w-lg w-full mx-4 text-center">
        {/* 404 number */}
        <p
          className="text-8xl font-bold mb-4 select-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "transparent",
            WebkitTextStroke: "2px #C17A72",
            opacity: 0.6,
          }}
        >
          404
        </p>

        {/* Headline */}
        <h1
          className="text-3xl font-semibold mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "#F1F5F9" }}
        >
          Page not found
        </h1>

        {/* Description */}
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Suggested links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95 inline-block"
            style={{
              background: "#C17A72",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Go to dashboard
          </Link>
          <Link
            href="/goals"
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80 active:scale-95 inline-block"
            style={{
              background: "#1F2D47",
              color: "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            View goals
          </Link>
        </div>

        {/* Subtle decorative bloom */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
          style={{ background: "rgba(193,122,114,0.04)", filter: "blur(120px)" }}
        />
      </div>
    </div>
  );
}
