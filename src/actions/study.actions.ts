"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/** 每日打卡 */
export async function checkin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("请先登录");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 检查今天是否已打卡
  const todayRecords = await prisma.learningRecord.findMany({
    where: {
      userId: session.user.id,
      type: "checkin",
      createdAt: { gte: today },
    },
  });

  if (todayRecords.length > 0) {
    return { done: true, message: "今天已打卡" };
  }

  await prisma.learningRecord.create({
    data: {
      userId: session.user.id,
      type: "checkin",
    },
  });

  return { done: true, message: "打卡成功！🔥" };
}

/** 查询学习日历数据（过去 N 天） */
export async function getStudyCalendar(days = 90) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const records = await prisma.learningRecord.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: since },
    },
    select: { createdAt: true },
  });

  // 按日期聚合
  const countByDay: Record<string, number> = {};
  for (const r of records) {
    const day = r.createdAt.toISOString().slice(0, 10);
    countByDay[day] = (countByDay[day] || 0) + 1;
  }

  // 生成连续日期数组
  const result: { date: string; count: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: countByDay[key] || 0 });
  }

  return result;
}

/** 查询今日是否已打卡 */
export async function getTodayCheckin() {
  const session = await auth();
  if (!session?.user?.id) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.learningRecord.count({
    where: {
      userId: session.user.id,
      type: "checkin",
      createdAt: { gte: today },
    },
  });

  return count > 0;
}
