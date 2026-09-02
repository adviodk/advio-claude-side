// Every external origin the site actually talks to from the browser:
// Google Analytics (gtag.js + beacons, only loaded post-consent) and
// FormSubmit (the contact/lead forms POST straight to it). Everything
// else is same-origin. 'unsafe-inline' on script-src/style-src is a
// known, deliberate looseness: next/script's inline GA init snippet and
// React's inline style={{}} usage across the site both need it, and
// there's no middleware/nonce plumbing in this app to tighten that
// further without a bigger change. No dangerouslySetInnerHTML or eval
// exists anywhere in the codebase, so the realistic injection surface
// this still blocks (a future XSS regression pulling in an arbitrary
// remote script, or exfiltrating data to a non-allowlisted origin) is
// still meaningfully reduced.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.google-analytics.com",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevents the site from being embedded in an <iframe> elsewhere —
          // blocks clickjacking attacks against the booking/contact forms.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from guessing content types for served files.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sends only the origin (not full URL/query) to other sites on
          // outbound link clicks, and nothing at all on downgrade.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site doesn't use any of these browser features.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Defense-in-depth against XSS/data-exfiltration even though no
          // active injection sink exists in the codebase today.
          { key: "Content-Security-Policy", value: CSP },
          // Belt-and-braces alongside Vercel's own HTTPS enforcement.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
