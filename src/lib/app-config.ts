/**
 * 应用全局配置常量
 */

export const IS_DEV = process.env.NODE_ENV !== "production";

/** CEFR 等级颜色映射 */
export const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  A2: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  B1: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  B2: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
  C1: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  C2: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
};

/** 试卷适用年级 */
export const GRADES = ["G1", "G2", "G3", "G4", "G5", "G6"] as const;

export const GRADE_LABELS: Record<string, string> = {
  G1: "一年级", G2: "二年级", G3: "三年级",
  G4: "四年级", G5: "五年级", G6: "六年级",
};

export const GRADE_COLORS: Record<string, string> = {
  G1: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  G2: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  G3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  G4: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-100",
  G5: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
  G6: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
};

export function getSourceLabel(): string {
  return "AI 生成";
}
