import Link from "next/link";
import { getArticles } from "@/actions/admin/articles.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LEVEL_COLORS, getSourceLabel } from "@/lib/app-config";
import { DeleteArticleButton } from "./delete-button";

const CATEGORY_LABELS: Record<string, string> = {
  DAILY: "日常", STORY: "故事", TECHNOLOGY: "科技",
  BUSINESS: "商务", ACADEMIC: "学术", CULTURE: "文化", NEWS: "新闻",
};

export default async function AdminArticles() {
  const articles = await getArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📝 文章管理</h1>
          <p className="text-muted-foreground mt-1">
            共 {articles.length} 篇文章
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/articles/new">
            <Button>＋ 新建文章</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">← 返回前台</Button>
          </Link>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">暂无文章</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={LEVEL_COLORS[article.level] || ""}>
                    {article.level}
                  </Badge>
                  <Badge variant="outline">{CATEGORY_LABELS[article.category] || article.category}</Badge>
                  <Badge variant={article.type === "TEXTBOOK" ? "default" : "secondary"}>
                    {article.type === "TEXTBOOK" ? "教材" : "课外"}
                  </Badge>
                  <Badge
                    variant={article.isPublic ? "default" : "secondary"}
                    className="ml-auto"
                  >
                    {article.isPublic ? "公开" : "草稿"}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-1 text-sm text-muted-foreground">
                <p>词数: {article.wordCount}</p>
                <p>
                  来源: {getSourceLabel()}
                </p>
                <p>
                  创建: {new Date(article.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </CardContent>
              <div className="mt-auto flex gap-2 p-4 pt-0">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="flex-1"
                >
                  <Button variant="secondary" className="w-full">
                    编辑
                  </Button>
                </Link>
                <div className="flex-1">
                  <DeleteArticleButton
                    articleId={article.id}
                    articleTitle={article.title}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
