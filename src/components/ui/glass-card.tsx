import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card p-8 rounded-2xl ${
        hover ? "transition-all duration-500 hover:border-[#C17A72]/30 hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
