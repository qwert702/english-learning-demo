/**
 * 统一环境配置读取层
 */

const isDev = process.env.NODE_ENV !== "production";

export const APP = {
  get publicUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get isDev(): boolean {
    return isDev;
  },
  get isProd(): boolean {
    return !isDev;
  },
};

export const DB = {
  get url(): string {
    const raw = process.env.DATABASE_URL ?? "file:./dev.db";
    return raw.replace("file:", "");
  },
};

export const DEPLOY = {
  get authUrl(): string {
    return process.env.AUTH_URL ?? "http://localhost:3000";
  },
};
