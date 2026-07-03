import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { CheckInButton } from "@/components/checkin-button";

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-3 ${className || ""}`}>
      <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
      <div className="h-8 w-1/2 rounded bg-muted animate-pulse" />
      <div className="h-3 w-1/4 rounded bg-muted/60 animate-pulse" />
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2"><div className="h-3 w-16 rounded bg-muted animate-pulse" /></CardHeader>
      <CardContent><div className="h-7 w-12 rounded bg-muted animate-pulse mb-1" /><div className="h-3 w-10 rounded bg-muted/60 animate-pulse" /></CardContent>
    </Card>
  );
}

function StatCard({ title, value, sub }: { title: string; value: number | string; sub: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

async function StatsGrid() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  const [articleCount, learningDates] = await prisma.$transaction([
    prisma.learningRecord.count({ where: { userId } }),
    prisma.learningRecord.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 365,
    }),
  ]);

  const dates = new Set(learningDates.map((r) => r.createdAt.toISOString().slice(0, 10)));
  let streak = 0;
  const d = new Date();
  while (dates.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
  const emoji = streak >= 14 ? "⚡" : streak >= 7 ? "🔥🔥🔥" : streak >= 4 ? "🔥🔥" : streak >= 1 ? "🔥" : "💤";

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <StatCard title="学习记录" value={articleCount} sub="次学习" />
      <StatCard title="学习天数" value={dates.size} sub="累计" />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">连续学习</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-1">{emoji} {streak}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">天连胜</p>
        </CardContent>
      </Card>
    </div>
  );
}

async function CheckInSection() {
  const session = await auth();
  if (!session?.user?.id) return <CheckInButton checkedInToday={false} />;
  const count = await prisma.learningRecord.count({
    where: { userId: session.user.id, type: "checkin", createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
  });
  return <CheckInButton checkedInToday={count > 0} />;
}

async function StudyCalendarSection() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const records = await prisma.learningRecord.findMany({
    where: { userId, createdAt: { gte: ninetyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const activity = records.reduce<Record<string, number>>((acc, r) => {
    const day = r.createdAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const data: { date: string; count: number }[] = [];
  for (let i = 90; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    data.push({ date: dt.toISOString().slice(0, 10), count: activity[dt.toISOString().slice(0, 10)] || 0 });
  }

  const { StudyCalendar } = await import("@/components/study-calendar");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><span>🔥</span>学习热力图</CardTitle>
      </CardHeader>
      <CardContent>
        <StudyCalendar data={data} />
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span>总学习天数: {Object.keys(activity).length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || undefined;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            欢迎回来{userName ? `，${userName}` : ""} 🎉
          </h1>
          <p className="text-muted-foreground mt-1">今天也要坚持学英语哦</p>
        </div>
        <Suspense fallback={<Button size="lg" variant="outline" className="gap-2" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>}>
          <CheckInSection />
        </Suspense>
      </div>

      <Suspense fallback={<div className="grid gap-4 grid-cols-2 md:grid-cols-4">{Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}</div>}>
        <StatsGrid />
      </Suspense>

      <Suspense fallback={<CardSkeleton className="h-48" />}>
        <StudyCalendarSection />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">👂 听力阅读</CardTitle>
            <p className="text-xs text-muted-foreground">选择文章阅读学习</p>
          </CardHeader>
          <CardContent>
            <Link href="/listening"><Button className="w-full">开始阅读</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
