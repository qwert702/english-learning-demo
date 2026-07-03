"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * 更新用户昵称
 */
export async function updateName(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 50) {
    return { error: "昵称长度为 1-50 个字符" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: trimmed },
  });

  return { success: true };
}

/**
 * 修改密码
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 密码强度验证
  if (newPassword.length < 8 || newPassword.length > 128) {
    return { error: "密码长度为 8-128 个字符" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return { error: "当前账户未设置密码（可能使用社交账号登录）" };
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return { error: "当前密码错误" };
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true };
}
