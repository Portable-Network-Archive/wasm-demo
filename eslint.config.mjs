import nextConfig from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules/", "out/", "docs/", "pna_wasm/pkg/"],
  },
  ...nextConfig,
  prettierConfig,
];
