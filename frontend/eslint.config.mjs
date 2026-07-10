import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
);
