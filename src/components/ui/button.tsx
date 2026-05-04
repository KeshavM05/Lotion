import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2";

  const variantStyles = {
    primary: "bg-[#C17A72] text-[#F5F5F5] hover:bg-[#b06a62] active:scale-95",
    secondary: "glass-card border-white/5 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5]",
    ghost: "bg-transparent text-[#9CA3AF] hover:bg-white/5 hover:text-[#F5F5F5]",
    danger: "text-red-400 hover:bg-red-500/10",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
