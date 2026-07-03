"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, AppError, ErrorCode } from "@/lib/errors";

function splitSentences(text: string): string[] {
  const protectedText = text
    .replace(/\b(Dr|Mr|Mrs|Ms|Prof|Sr|Jr|St|Mt|Ave|Blvd|Dept|vs|etc|e\.g|i\.e|al)\./gi, (m) => m.replace(".", "\0DOT"))
    .replace(/\b([A-Z])\./g, (m) => m.replace(".", "\0DOT"))
    .replace(/\.{3,}/g, "\0ELLIPSIS")
    .replace(/\.\d+/g, (m) => m.replace(".", "\0DOTNUM"));

  const raw = protectedText.match(/[^!?。]+[!?。]?/g) || [protectedText];

  return raw
    .map((s) =>
      s.trim().replace(/\0DOT/g, ".").replace(/\0ELLIPSIS/g, "...").replace(/\0DOTNUM/g, ".")
    )
    .filter(Boolean);
}

type CreateArticleInput = {
  title: string;
  content: string;
  level: string;
  category: string;
  isPublic: boolean;
  sourceUrl?: string;
  type?: string;
  grade?: string;
};

export async function getArticles() {
  const session = await auth();
  requireAdmin(session);

  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      level: true,
      category: true,
      type: true,
      wordCount: true,
      isPublic: true,
      source: true,
      createdAt: true,
    },
  });
}

export async function getArticle(id: string) {
  const session = await auth();
  requireAdmin(session);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new AppError(ErrorCode.NOT_FOUND, "文章不存在");

  return {
    ...article,
    sentences: JSON.parse(article.sentences),
  };
}

export async function createArticle(input: CreateArticleInput) {
  const session = await auth();
  requireAdmin(session);

  const sentences = splitSentences(input.content);
  const wordCount = input.content.split(/\s+/).filter(Boolean).length;

  const sentenceData = sentences.map((text, i) => ({
    text,
    startTime: i * 4,
    cn: "",
  }));

  const article = await prisma.article.create({
    data: {
      title: input.title,
      content: input.content,
      level: input.level,
      category: input.category,
      source: "ai_generated",
      sourceUrl: input.sourceUrl || null,
      type: input.type || "EXTRA",
      grade: input.grade || null,
      wordCount,
      isPublic: input.isPublic,
      sentences: JSON.stringify(sentenceData),
    },
  });

  return article;
}

type UpdateArticleInput = Partial<CreateArticleInput> & {
  sentences?: { text: string; startTime: number; cn: string }[];
};

export async function updateArticle(id: string, input: UpdateArticleInput) {
  const session = await auth();
  requireAdmin(session);

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error("文章不存在");

  const data: Record<string, unknown> = {};

  if (input.title) data.title = input.title;
  if (input.content) {
    data.content = input.content;
    data.wordCount = input.content.split(/\s+/).filter(Boolean).length;
    if (!input.sentences) {
      const sentences = splitSentences(input.content);
      data.sentences = JSON.stringify(
        sentences.map((text, i) => ({ text, startTime: i * 4, cn: "" }))
      );
    }
  }
  if (input.level) data.level = input.level;
  if (input.category) data.category = input.category;
  if (input.isPublic !== undefined) data.isPublic = input.isPublic;
  if (input.sourceUrl !== undefined) data.sourceUrl = input.sourceUrl;
  if (input.type) data.type = input.type;
  if (input.grade !== undefined) data.grade = input.grade || null;
  if (input.sentences) data.sentences = JSON.stringify(input.sentences);

  const article = await prisma.article.update({ where: { id }, data });

  return article;
}

export async function deleteArticle(id: string) {
  const session = await auth();
  requireAdmin(session);

  await prisma.article.delete({ where: { id } });

  return { success: true };
}
