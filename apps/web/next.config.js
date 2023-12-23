import { withContentlayer } from "next-contentlayer";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com"],
  },
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };
    return config;
  },
};

export default withContentlayer(config);
