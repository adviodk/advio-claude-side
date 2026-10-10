"use client";

import Link from "next/link";
import { trackMetaEvent } from "@/lib/metaPixel";

/** A plain, unstyled Link that logs a CTAClick — usable from server components. */
export default function TrackedLink({
  href,
  location,
  className,
  children,
}: {
  href: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackMetaEvent("CTAClick", { location })}>
      {children}
    </Link>
  );
}
