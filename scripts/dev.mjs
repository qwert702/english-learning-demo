/**
 * dev.mjs — 开发服务器启动脚本
 *
 * 用法：npm run dev
 */

import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

process.env.AUTH_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const nextBin = resolve(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next"
);

const args = ["dev"];

const child =
  process.platform === "win32"
    ? spawn(
        `"${nextBin}" ${args.map((a) => (a.includes(" ") ? `"${a}"` : a)).join(" ")}`,
        { cwd: projectRoot, stdio: "inherit", env: process.env, shell: true }
      )
    : spawn(nextBin, args, {
        cwd: projectRoot,
        stdio: "inherit",
        env: process.env,
      });

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
  process.exit(0);
});
