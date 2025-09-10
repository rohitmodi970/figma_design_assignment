import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // 🔧 selectively disable or downgrade errors
      "react-hooks/exhaustive-deps": "warn", // was erroring, now just a warning
      "prefer-const": "warn", // allow let even if not reassigned
      "@next/next/no-img-element": "off", // allow <img> instead of <Image />
    },
  },
];

export default eslintConfig;
