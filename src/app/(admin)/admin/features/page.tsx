"use client";

import { useState, useEffect } from "react";
import { getDisabledFeatures, setAllFeatures, toggleFeature } from "@/actions/admin/features.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const FEATURES: { key: string; label: string }[] = [
  { key: "textbook_mode", label: "教材模式" },
  { key: "exam_mode", label: "实战模式" },
  { key: "listening", label: "听力阅读" },
  { key: "dictation", label: "听写训练" },
  { key: "pronunciation", label: "发音评分" },
  { key: "ai_assistant", label: "AI 学习助手" },
  { key: "vocabulary", label: "单词本" },
  { key: "battle", label: "单词PK" },
  { key: "leaderboard", label: "排行榜" },
  { key: "reports", label: "学习报告" },
  { key: "ai_tools", label: "AI 工具" },
  { key: "settings", label: "设置" },
  { key: "speaking_practice", label: "口语陪练" },
  { key: "floating_ai", label: "浮动 AI 助手" },
];

export default function FeaturesPage() {
  const [disabledFeatures, setDisabledFeatures] = useState<string[] | null>(null);

  useEffect(() => {
    getDisabledFeatures().then(setDisabledFeatures);
  }, []);

  const handleToggle = async (feature: string, currentlyDisabled: boolean) => {
    try {
      const result = await toggleFeature(feature, !currentlyDisabled);
      setDisabledFeatures(result.disabledFeatures);
      toast.success(`已${currentlyDisabled ? "启用" : "禁用"} ${FEATURES.find(f => f.key === feature)?.label || feature}`);
    } catch {
      toast.error("操作失败");
    }
  };

  if (disabledFeatures === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🔧 功能管理</h1>
        <p className="text-muted-foreground mt-1">启用或禁用站点的各功能模块</p>
      </div>

      {/* 批量操作 */}
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          onClick={async () => {
            try {
              const result = await setAllFeatures(false);
              setDisabledFeatures(result.disabledFeatures);
              toast.success("已启用全部功能");
            } catch {
              toast.error("操作失败");
            }
          }}
          disabled={disabledFeatures.length === 0}
        >
          ✅ 启用全部
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            try {
              const result = await setAllFeatures(true);
              setDisabledFeatures(result.disabledFeatures);
              toast.success("已禁用全部功能");
            } catch {
              toast.error("操作失败");
            }
          }}
          disabled={disabledFeatures.length === Object.keys(FEATURES).length}
        >
          🚫 禁用全部
        </Button>
      </div>

      <div className="space-y-3">
        {Object.entries(FEATURES).map(([key, feat]) => {
          const isDisabled = disabledFeatures.includes(key);
          return (
            <Card key={key}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium">{feat.label}</span>
                    <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{key}</code>
                    <Badge variant={isDisabled ? "secondary" : "default"}>
                      {isDisabled ? "已禁用" : "已启用"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{feat.key}</p>
                </div>
                <Button
                  variant={isDisabled ? "default" : "outline"}
                  onClick={() => handleToggle(key, isDisabled)}
                  className="ml-4 flex-shrink-0"
                >
                  {isDisabled ? "启用" : "禁用"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(FEATURES).length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">暂无可管理的功能</p>
        </div>
      )}
    </div>
  );
}
