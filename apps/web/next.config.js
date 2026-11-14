/** @type {import("next").NextConfig} */
const nextConfig = {
  // Our packages ship TypeScript source (no build step), so Next compiles them.
  transpilePackages: ["@packages/shared", "@packages/ui"],
};

export default nextConfig;
