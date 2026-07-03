"use server";

import { prisma } from "@/lib/prisma";

/** 获取公开文章（免费试读） */
export async function getPublicArticles() {
  const articles = await prisma.article.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      level: true,
      category: true,
      wordCount: true,
    },
  });
  return articles;
}
