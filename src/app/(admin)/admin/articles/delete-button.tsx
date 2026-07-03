"use client";

import { useRouter } from "next/navigation";
import { deleteArticle } from "@/actions/admin/articles.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteArticleButton({
  articleId,
  articleTitle,
}: {
  articleId: string;
  articleTitle: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`确定删除「${articleTitle}」？此操作不可撤销。`)) return;

    try {
      await deleteArticle(articleId);
      toast.success("文章已删除");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败");
    }
  }

  return (
    <Button variant="destructive" className="w-full" onClick={handleDelete}>
      删除
    </Button>
  );
}
