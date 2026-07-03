"use client";

interface StudyCalendarProps {
  data: { date: string; count: number }[];
}

function getColor(count: number): string {
  if (count === 0) return "bg-muted";
  if (count <= 1) return "bg-green-200 dark:bg-green-900";
  if (count <= 3) return "bg-green-400 dark:bg-green-700";
  return "bg-green-600 dark:bg-green-500";
}

function getOpacity(count: number): string {
  if (count === 0) return "opacity-40";
  if (count <= 1) return "opacity-60";
  if (count <= 3) return "opacity-80";
  return "opacity-100";
}

export function StudyCalendar({ data }: StudyCalendarProps) {
  if (!data || data.length === 0) return null;

  // 按周分组：每周 7 行
  const weeks: typeof data[] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  // 月份标签
  const monthLabels: { label: string; index: number }[] = [];
  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    if (week.length === 0) return;
    const m = new Date(week[0]!.date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: months[m]!, index: wi });
      lastMonth = m;
    }
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-0.5">
        {/* Month labels */}
        <div className="flex gap-0.5" style={{ minWidth: weeks.length * 14 }}>
          {monthLabels.map((m) => (
            <div
              key={m.label}
              className="text-[9px] text-muted-foreground"
              style={{ marginLeft: m.index * 14 }}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-0.5 mt-1">
        {/* Column: Mon, Wed, Fri labels */}
        <div className="flex flex-col gap-0.5 text-[8px] text-muted-foreground mr-1 leading-[14px]">
          <span>一</span>
          <span className="mt-[18px]">三</span>
          <span className="mt-[18px]">五</span>
        </div>
        {/* Grid */}
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${getColor(day.count)} ${getOpacity(day.count)}`}
                  title={`${day.date}: ${day.count} 次`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[9px] text-muted-foreground">
        <span>少</span>
        <div className="w-3 h-3 rounded-sm bg-muted opacity-40" />
        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900 opacity-60" />
        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700 opacity-80" />
        <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500 opacity-100" />
        <span>多</span>
      </div>
    </div>
  );
}
