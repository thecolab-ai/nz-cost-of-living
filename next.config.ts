import type { NextConfig } from "next";

// Published as a fully static site to GitHub Pages (no backend).
// On GitHub Actions the site is served from https://thecolab-ai.github.io/<repo>/,
// so it needs a basePath; locally (dev / non-CI build) it stays at the root.
const repo = "nz-cost-of-living";
const isCI = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isCI ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` } : {}),
};

export default nextConfig;
