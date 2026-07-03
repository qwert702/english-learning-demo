"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle } from "@/actions/admin/articles.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { GRADES, GRADE_LABELS } from "@/lib/app-config";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const CATEGORIES = [
  { value: "DAILY", label: "日常" },
  { value: "STORY", label: "故事" },
  { value: "TECHNOLOGY", label: "科技" },
  { value: "BUSINESS", label: "商务" },
  { value: "ACADEMIC", label: "学术" },
  { value: "CULTURE", label: "文化" },
  { value: "NEWS", label: "新闻" },
] as const;

type Sentence = { text: string; startTime: number; cn: string };

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    content: string;
    level: string;
    category: string;
    isPublic: boolean;
    sourceUrl: string | null;
    sentences: Sentence[];
    type?: string;
  };
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!article;
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState(article?.title ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [level, setLevel] = useState(article?.level ?? "A1");
  const [category, setCategory] = useState(article?.category ?? "STORY");
  const [type, setType] = useState(article?.type ?? "EXTRA");
  const [grade, setGrade] = useState((article as any)?.grade ?? "");
  const [isPublic, setIsPublic] = useState(article?.isPublic ?? false);
  const [sourceUrl, setSourceUrl] = useState(article?.sourceUrl ?? "");

  // 句子编辑模式（仅编辑时可用）
  const [sentences, setSentences] = useState<Sentence[]>(
    article?.sentences ?? []
  );
  const [editingSentences, setEditingSentences] = useState(
    article ? article.sentences.length > 0 : false
  );

  // 当正文变化时重新拆分子句预览
  const previewSentences = content
    .match(/[^.!?]+[.!?]+/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? [content].filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("请填写标题和正文");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateArticle(article.id, {
          title: title.trim(),
          content: content.trim(),
          level,
          category,
          isPublic,
          sourceUrl: sourceUrl.trim() || undefined,
          type,
          grade: grade || undefined,
          sentences: editingSentences ? sentences : undefined,
        });
        toast.success("文章已更新");
      } else {
        await createArticle({
          title: title.trim(),
          content: content.trim(),
          level,
          category,
          isPublic,
          sourceUrl: sourceUrl.trim() || undefined,
          type,
          grade: grade || undefined,
        });
        toast.success("文章已创建");
      }
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* 标题 */}
      <div>
        <label className="text-sm font-medium block mb-1.5">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          placeholder="文章标题（英文）"
          required
        />
      </div>

      {/* 级别和分类 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">难度级别</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 文章类型 */}
      <div>
        <label className="text-sm font-medium block mb-1.5">文章类型</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
        >
          <option value="EXTRA">课外</option>
          <option value="TEXTBOOK">教材</option>
          <option value="EXAM">试卷</option>
        </select>
      </div>

      {/* 适用年级（仅试卷类型） */}
      {type === "EXAM" && (
        <div>
          <label className="text-sm font-medium block mb-1.5">适用年级</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          >
            <option value="">选择年级</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{GRADE_LABELS[g]}</option>
            ))}
          </select>
        </div>
      )}

      {/* 来源信息 */}
      <div>
        <label className="text-sm font-medium block mb-1.5">
          来源说明（可选）
          <span className="text-xs text-muted-foreground ml-1">
            如原文链接或改编来源
          </span>
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          placeholder="如：https://example.com/article"
        />
      </div>

      {/* 正文 */}
      <div>
        <label className="text-sm font-medium block mb-1.5">
          正文
          <span className="text-xs text-muted-foreground ml-2">
            （系统将按句号感叹号等自动拆分，共约 {previewSentences.length} 句）
          </span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-y"
          placeholder="在此输入英文正文..."
          required
        />
      </div>

      {/* 句子预览 */}
      {previewSentences.length > 0 && (
        <Card>
          <div className="p-3 border-b bg-muted/30 text-sm font-medium flex items-center justify-between">
            <span>📖 句子预览（{previewSentences.length} 句）</span>
            {isEdit && (
              <button
                type="button"
                onClick={() => setEditingSentences(!editingSentences)}
                className="text-xs text-primary underline"
              >
                {editingSentences ? "收起翻译编辑" : "编辑中文翻译"}
              </button>
            )}
          </div>
          <CardContent className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {previewSentences.map((s, i) => (
              <div key={i} className="text-sm">
                <p className="text-foreground">
                  <span className="text-muted-foreground mr-1">[{i + 1}]</span>
                  {s}
                </p>
                {editingSentences && sentences[i] ? (
                  <input
                    type="text"
                    value={sentences[i]?.cn ?? ""}
                    onChange={(e) => {
                      const next = [...sentences];
                      if (!next[i]) {
                        next[i] = { text: s, startTime: i * 4, cn: "" };
                      }
                      next[i] = { ...next[i]!, cn: e.target.value };
                      setSentences(next);
                    }}
                    className="mt-1 w-full rounded border px-2 py-1 text-xs bg-background"
                    placeholder="中文翻译（可选）"
                  />
                ) : (
                  sentences[i]?.cn && (
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {sentences[i]?.cn}
                    </p>
                  )
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 是否公开 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded border"
        />
        <label htmlFor="isPublic" className="text-sm">
          公开可见（关闭则为草稿）
        </label>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "保存中..." : isEdit ? "保存修改" : "创建文章"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/articles")}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
