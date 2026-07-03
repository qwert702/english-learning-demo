"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export type AuthState = { error?: string; success?: boolean };

function validatePassword(password: string): string | null {
  if (password.length < 8) return "密码至少需要 8 位";
  if (password.length > 128) return "密码不能超过 128 位";
  if (!/[a-zA-Z]/.test(password)) return "密码必须包含至少一个字母";
  if (!/[0-9]/.test(password)) return "密码必须包含至少一个数字";
  return null;
}

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "请填写所有字段" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "请输入正确的邮箱格式" };

  const pwError = validatePassword(password);
  if (pwError) return { error: pwError };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "该邮箱已被注册" };

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch {
    return { error: "注册成功但登录失败，请手动登录" };
  }

  redirect("/dashboard");
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState | never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "请填写邮箱和密码" };

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      if ((error as any).code === "Banned") return { error: "账户已被禁用，无法登录" };
      return { error: "邮箱或密码错误" };
    }
    return { error: "登录失败，请稍后重试" };
  }

  return { success: true };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
