import Link from "next/link";
import { ReactNode } from "react";

type Common = {
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
};

const base =
  "group/btn relative inline-flex items-center gap-3 overflow-hidden px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300";

const variants = {
  solid: "bg-beige text-navyDeep hover:bg-beigeDeep",
  ghost:
    "border border-white/20 text-white hover:border-white/40 hover:bg-white/5",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="relative inline-block h-3 w-4 overflow-hidden"
    >
      <span className="absolute inset-0 flex translate-x-0 items-center transition-transform duration-300 ease-out group-hover/btn:translate-x-4">
        →
      </span>
      <span className="absolute inset-0 flex -translate-x-4 items-center transition-transform duration-300 ease-out group-hover/btn:translate-x-0">
        →
      </span>
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: Common & { href: string }) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      <Arrow />
    </Link>
  );
}

export function ButtonAnchor({
  href,
  children,
  variant = "solid",
  className = "",
}: Common & { href: string }) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <Arrow />
    </a>
  );
}

export function ButtonSubmit({
  children,
  variant = "solid",
  className = "",
  disabled = false,
}: Common & { disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${base} w-full justify-center ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
      <Arrow />
    </button>
  );
}

export function Button({
  children,
  variant = "solid",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: Common & {
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} justify-center ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
      <Arrow />
    </button>
  );
}
