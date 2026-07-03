import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArticleFilters } from "./article-filters";
import { LEVEL_COLORS, GRADE_LABELS, GRADE_COLORS, getSourceLabel } from "@/lib/app-config";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

function ArticleListSkeleton() {
  return (
    <section>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex flex-col animate-pulse">
            <CardHeader>
              <div className="h-4 w-16 rounded bg-muted mb-2" />
              <div className="h-5 w-3/4 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-3 w-1/3 rounded bg-muted/60" />
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="h-9 w-full rounded bg-muted" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

async function ArticleListContent({
  level,
  category,
  mode,
  grade,
}: {
  level: string;
  category: string;
  mode: string;
  grade: string;
}) {
  const where: Record<string, string> = {};
  if (mode === "exam") {
    where.type = "EXAM";
    if (grade) where.grade = grade;
  } else if (mode === "textbook") {
    where.type = "TEXTBOOK";
    if (level && LEVELS.includes(level as typeof LEVELS[number])) where.level = level;
  } else {
    where.type = "EXTRA";
    if (level && LEVELS.includes(level as typeof LEVELS[number])) where.level = level;
  }
  if (category && category !== "ALL") where.category = category;

  const articles = await prisma.article.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      level: true,
      category: true,
      grade: true,
      wordCount: true,
      source: true,
      createdAt: true,
    },
  });

  const isExam = mode === "exam";

  return (
    <>
      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">暂未有相关文章</p>
        </div>
      ) : (
        <section>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {isExam && article.grade ? (
                      <Badge className={GRADE_COLORS[article.grade] || ""}>
                        {GRADE_LABELS[article.grade] || article.grade}
                      </Badge>
                    ) : (
                      <Badge className={LEVEL_COLORS[article.level] || ""}>
                        {article.level}
                      </Badge>
                    )}
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-snug">{article.title}</CardTitle>
                  <CardDescription>
                    {article.wordCount} 词 · {getSourceLabel()}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Link href={`/listening/${article.id}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      开始阅读
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default async function ListeningPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; category?: string; mode?: string; grade?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const level = params.level || "";
  const category = params.category || "";
  const mode = params.mode || "extra";
  const grade = params.grade || "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">听力阅读</h1>
        <p className="text-muted-foreground mt-1">选择文章阅读学习</p>
      </div>

      {/* 模式切换 */}
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="inline-flex rounded-lg border p-0.5 bg-muted/50">
          <Link
            href={`/listening?mode=extra${level ? `&level=${level}` : ""}${category ? `&category=${category}` : ""}`}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              mode === "extra" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            课外模式
          </Link>
          <Link
            href={`/listening?mode=textbook${level ? `&level=${level}` : ""}${category ? `&category=${category}` : ""}`}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              mode === "textbook" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            教材模式
          </Link>
          <Link
            href={`/listening?mode=exam${grade ? `&grade=${grade}` : ""}`}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              mode === "exam" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            实战模式
          </Link>
        </div>
      </div>

      <ArticleFilters level={level} category={category} mode={mode} grade={grade} />

      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleListContent level={level} category={category} mode={mode} grade={grade} />
      </Suspense>
    </div>
  );
}
