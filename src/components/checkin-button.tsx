"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { checkin } from "@/actions/study.actions";
import { toast } from "sonner";

export function CheckInButton({ checkedInToday }: { checkedInToday: boolean }) {
  const [checkedIn, setCheckedIn] = useState(checkedInToday);
  const [checking, setChecking] = useState(false);

  const handleCheckin = async () => {
    setChecking(true);
    try {
      const res = await checkin();
      if (res.done) { setCheckedIn(true); toast.success(res.message); }
    } catch { toast.error("打卡失败，请重试"); }
    setChecking(false);
  };

  return (
    <Button onClick={handleCheckin} disabled={checkedIn || checking} size="lg"
      variant={checkedIn ? "outline" : "default"} className="gap-2">
      {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : checkedIn ? "✅ 已打卡" : "🔥 今日打卡"}
    </Button>
  );
}
