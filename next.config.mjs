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
        ],
      },
    ];
  },
};

export default nextConfig;
