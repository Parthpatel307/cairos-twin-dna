import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-lime-300 text-black hover:bg-lime-200",
    secondary:
      "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]",
    danger:
      "border border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/15",
  };

  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2.5 text-xs font-bold transition",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}