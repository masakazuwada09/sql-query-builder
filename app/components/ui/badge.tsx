import { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary";
}

export const Badge: FC<BadgeProps> = ({ variant = "default", className, children, ...props }) => {
  let base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";

  const variants: Record<string, string> = {
    default: "bg-gray-200 text-gray-800",
    outline: "border border-gray-300 text-gray-800",
    secondary: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
