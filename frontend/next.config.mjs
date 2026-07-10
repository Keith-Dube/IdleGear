/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gearshare/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
