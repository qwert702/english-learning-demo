import { getArticle } from "@/actions/admin/articles.actions";
import { notFound } from "next/navigation";
import { ArticleForm } from "../../article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let article;
  try {
    article = await getArticle(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">✏️ 编辑文章</h1>
        <p className="text-muted-foreground mt-1">{article.title}</p>
      </div>
      <ArticleForm article={article} />
    </div>
  );
}
