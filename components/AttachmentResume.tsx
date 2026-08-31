"use client";

import { useEffect } from "react";
import { drainOutbox } from "@/lib/attachmentOutbox";

/**
 * Headless. Mountes i root layout, så et hvilket som helst nyt besøg på
 * advio.dk genoptager en billed-upload, der ikke nåede at blive færdig (fx
 * fordi brugeren lukkede fanen på kalendersiden). Renderer intet — den
 * synlige status vises af <UploadStatus /> på /formular/book.
 */
export default function AttachmentResume() {
  useEffect(() => {
    // Kør efter første paint, så det ikke konkurrerer med sideindlæsningen.
    const id = window.setTimeout(() => {
      void drainOutbox({ resumed: true });
    }, 800);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
