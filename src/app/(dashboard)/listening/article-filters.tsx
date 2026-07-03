"use client";

import { useRouter } from "next/navigation";
import { GRADES, GRADE_LABELS } from "@/lib/app-config";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const CATEGORIES = [
  { value: "ALL", label: "全部" },
  { value: "DAILY", label: "日常" },
  { value: "STORY", label: "故事" },
  { value: "TECHNOLOGY", label: "科技" },
  { value: "BUSINESS", label: "商务" },
  { value: "ACADEMIC", label: "学术" },
  { value: "CULTURE", label: "文化" },
  { value: "NEWS", label: "新闻" },
];

export function ArticleFilters({ level, category, mode, grade }: { level: string; category: string; mode?: string; grade?: string }) {
  const router = useRouter();
  const isExam = mode === "exam";

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* 实战模式 → 年级筛选；其他模式 → 难度筛选 */}
      {isExam ? (
        <div>
          <label htmlFor="grade-filter" className="text-sm font-medium text-muted-foreground mr-2">
            年级
          </label>
          <select
            id="grade-filter"
            title="选择适用年级"
            aria-label="选择适用年级"
            value={grade || ""}
            className="rounded-md border px-3 py-1.5 text-sm bg-background"
            onChange={(e) => {
              const url = new URL(window.location.href);
              const value = e.target.value;
              if (value) url.searchParams.set("grade", value);
              else url.searchParams.delete("grade");
              url.searchParams.set("mode", "exam");
              router.push(url.toString());
            }}
          >
            <option value="">全部</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{GRADE_LABELS[g]}</option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label htmlFor="level-filter" className="text-sm font-medium text-muted-foreground mr-2">
            难度
          </label>
          <select
            id="level-filter"
            title="选择难度等级"
            aria-label="选择难度等级"
            value={level}
            className="rounded-md border px-3 py-1.5 text-sm bg-background"
            onChange={(e) => {
              const url = new URL(window.location.href);
              const value = e.target.value;
              if (value) url.searchParams.set("level", value);
              else url.searchParams.delete("level");
              if (mode) url.searchParams.set("mode", mode);
              router.push(url.toString());
            }}
          >
            <option value="">全部</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground mr-2">
          分类
        </label>
        <select
          id="category-filter"
          title="选择文章分类"
          aria-label="选择文章分类"
          value={category || "ALL"}
          className="rounded-md border px-3 py-1.5 text-sm bg-background"
          onChange={(e) => {
            const url = new URL(window.location.href);
            const value = e.target.value;
            if (value && value !== "ALL") url.searchParams.set("category", value);
            else url.searchParams.delete("category");
            if (mode) url.searchParams.set("mode", mode);
            router.push(url.toString());
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
