const path = require("path");
/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  images: {
    domains: ["localhost", "api.jimmodel.com"]
  },
  output: "standalone",
  experimental: {
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, "../../"),
  }
};

module.exports = nextConfig;
