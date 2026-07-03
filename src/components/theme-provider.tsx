/**
 * 主题工具函数
 *
 * 替代 next-themes 的轻量实现。
 *
 * FOUC 处理策略：
 * - SSR 阶段始终假定为暗色主题（在 layout.tsx 中设置 className="dark"）
 * - useEffect 在客户端水合后立即读取 localStorage 并切换
 * - suppressHydrationWarning 跳过 SSR/CSR 差异对比
 * - 不使用任何 <script>/<Script> 标签，避免 React 19 水合警告
 */

"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** 获取系统主题偏好 */
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** 解析主题（system → 具体值） */
function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

/** 读取 localStorage 保存的主题（服务端返回默认值） */
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {}
  return "system";
}

/** 写入主题到 localStorage 并更新 DOM class */
function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    const resolved = resolveTheme(stored);
    setResolvedTheme(resolved);
    applyTheme(stored);

    // 监听系统主题变化
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setThemeState((prev) => {
        if (prev === "system") {
          const r = getSystemTheme();
          setResolvedTheme(r);
          applyTheme("system");
          return "system";
        }
        return prev;
      });
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
    applyTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
