/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.BASE_PATH,
  turbopack: {},
};

module.exports = nextConfig;
