"use client";

import { ButtonLink } from "./Button";
import { trackMetaEvent } from "@/lib/metaPixel";

/**
 * Thin client wrapper around ButtonLink: Server Components (Header, Hero,
 * Features) can't hand an event-handler closure across the client boundary
 * themselves, so the tracking call lives here instead — callers only pass
 * serializable props.
 */
export default function TrackedButtonLink({
  href,
  location,
  children,
  className,
  variant,
}: {
  href: string;
  location: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "ghost";
}) {
  return (
    <ButtonLink
      href={href}
      className={className}
      variant={variant}
      onClick={() => trackMetaEvent("CTAClick", { location })}
    >
      {children}
    </ButtonLink>
  );
}
