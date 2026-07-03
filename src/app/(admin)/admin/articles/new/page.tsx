import { ArticleForm } from "../article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📝 新建文章</h1>
        <p className="text-muted-foreground mt-1">
          创建新的学习文章，系统将自动拆分句子
        </p>
      </div>
      <ArticleForm />
    </div>
  );
}
