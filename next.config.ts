import type { NextConfig } from "next";

// Support GitHub Pages base path via environment variable
// For project sites: username.github.io/repo-name
// For org/user sites: username.github.io (no basePath needed)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  // trailingSlash is required for GitHub Pages to serve subdirectories correctly
  trailingSlash: true,
  // Disable image optimization (not supported in static export without a server)
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages project sites
  ...(basePath ? { basePath } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
