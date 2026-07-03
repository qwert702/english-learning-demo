import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArticleReader } from "./article-reader";
import { ExamView, type ExamData } from "./exam-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cache } from "react";

interface Sentence {
  text: string;
  startTime: number;
  cn?: string;
}

const getArticle = cache(async (id: string) => {
  return prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      level: true,
      category: true,
      type: true,
      sentences: true,
      audioUrl: true,
      wordCount: true,
    },
  });
});

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 并行化：认证查询和文章查询同时进行
  const [session, article] = await Promise.all([
    auth(),
    getArticle(id),
  ]);

  if (!session?.user) redirect("/login");

  if (!article) notFound();

  if (article.type === "EXAM") {
    const examData: ExamData = JSON.parse(article.sentences);
    return <ExamView examData={examData} />;
  }

  const sentences: Sentence[] =
    typeof article.sentences === "string"
      ? JSON.parse(article.sentences)
      : (article.sentences);

  return (
    <ArticleReader
      articleId={article.id}
      title={article.title}
      content={article.content}
      sentences={sentences}
      level={article.level}
      category={article.category}
      wordCount={article.wordCount}
      userId={session.user.id}
    />
  );
}
