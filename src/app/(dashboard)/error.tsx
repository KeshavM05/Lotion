"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard render error:", error);
  }, [error]);

  return (
    <div
      className="flex items-center justify-center min-h-[60vh]"
      style={{ background: "var(--bg-primary, #0F1729)" }}
    >
      <div
        className="max-w-md w-full mx-4 rounded-2xl p-8 text-center"
        style={{ background: "#1F2D47", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(193,122,114,0.15)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C17A72"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Headline */}
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "#F1F5F9" }}
        >
          Something went wrong
        </h1>

        {/* Message */}
        <p className="text-sm mb-2" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
          An unexpected error occurred while rendering this page.
        </p>

        {error.message && (
          <p
            className="text-xs mb-6 font-mono px-3 py-2 rounded-lg"
            style={{
              color: "#C17A72",
              background: "rgba(193,122,114,0.08)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {error.message}
          </p>
        )}

        {!error.message && <div className="mb-6" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "#C17A72",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#9CA3AF",
              fontFamily: "Inter, sans-serif",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Go to dashboard
          </button>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs" style={{ color: "#4B5563", fontFamily: "JetBrains Mono, monospace" }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
