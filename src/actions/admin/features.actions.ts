"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/errors";

const FEATURES_KEYS: Record<string, string> = {
  textbook_mode: "教材模式",
  exam_mode: "实战模式",
  listening: "听力阅读",
  dictation: "听写训练",
  pronunciation: "发音评分",
  ai_assistant: "AI 学习助手",
  vocabulary: "单词本",
  battle: "单词PK",
  leaderboard: "排行榜",
  reports: "学习报告",
  ai_tools: "AI 工具",
  settings: "设置",
  speaking_practice: "口语陪练",
  floating_ai: "浮动 AI 助手",
};

/**
 * 获取当前被禁用的功能列表
 * 服务端组件调用，无需权限（只读）
 */
export async function getDisabledFeatures(): Promise<string[]> {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
    if (!config) return [];
    return JSON.parse(config.disabledFeatures) as string[];
  } catch {
    return [];
  }
}

/**
 * 启用/禁用某个功能（管理员专用）
 */
export async function toggleFeature(feature: string, disabled: boolean) {
  const session = await auth();
  requireAdmin(session);

  let config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: "global" } });
  }

  const current: string[] = JSON.parse(config.disabledFeatures);
  const updated = disabled
    ? [...new Set([...current, feature])]
    : current.filter((f) => f !== feature);

  await prisma.siteConfig.update({
    where: { id: "global" },
    data: { disabledFeatures: JSON.stringify(updated) },
  });

  return { disabledFeatures: updated };
}

/**
 * 批量启用或禁用所有功能（管理员专用）
 */
export async function setAllFeatures(disabled: boolean) {
  const session = await auth();
  requireAdmin(session);

  let config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: "global" } });
  }

  const allKeys = Object.keys(FEATURES_KEYS);
  const updated = disabled ? allKeys : [];

  await prisma.siteConfig.update({
    where: { id: "global" },
    data: { disabledFeatures: JSON.stringify(updated) },
  });

  return { disabledFeatures: updated };
}
