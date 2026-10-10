"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// While the redesign is being built, "/" (current site) and "/redesign" run
// side by side. Shared pages (formular, booking, privatlivspolitik) send the
// visitor back to whichever front page they came from, remembered per tab.
const KEY = "advio-forside";

/** Remembers which front page the visitor last saw. Rendered once in the root layout. */
export function FrontPageMarker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      if (pathname === "/") sessionStorage.setItem(KEY, "/");
      else if (pathname === "/redesign" || pathname.startsWith("/redesign/")) sessionStorage.setItem(KEY, "/redesign");
    } catch {}
  }, [pathname]);
  return null;
}

/** "Back to the front page" link that returns to the front page the visitor came from (default "/"). */
export default function HomeLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const [href, setHref] = useState("/");
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === "/redesign") setHref("/redesign");
    } catch {}
  }, []);
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
