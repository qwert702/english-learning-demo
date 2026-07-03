import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "vitest.config.ts",
    "commitlint.config.js",
  ]),
  // 自定义规则
  {
    rules: {
      // 不允许 console.log 在生产代码中
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // catch {} 列为警告而非错误：很多场景（日志、清理、音频降级）
      // 空 catch 为不中断主流程而设计，有注释说明意图
      "no-empty": "warn",
    },
  },
  // TypeScript 严格规则
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["src/**/*.ts", "src/**/*.tsx"],
  })),
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-import-type-side-effects": "warn",
    },
  },
]);

export default eslintConfig;
