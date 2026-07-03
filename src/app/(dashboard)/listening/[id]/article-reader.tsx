"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEVEL_COLORS, getSourceLabel } from "@/lib/app-config";

interface Sentence {
  text: string;
  startTime: number;
  cn?: string;
}

interface ArticleReaderProps {
  articleId: string;
  title: string;
  content: string;
  sentences: Sentence[];
  level: string;
  category: string;
  wordCount: number;
  userId: string;
}

export function ArticleReader({ title, content, sentences, level, category, wordCount }: ArticleReaderProps) {
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={LEVEL_COLORS[level] || ""}>{level}</Badge>
          <Badge variant="outline">{category}</Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {wordCount} 词 · {getSourceLabel()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📖 正文</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sentences.length > 0 ? (
            <div className="space-y-3">
              {sentences.map((s, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg transition-colors cursor-pointer ${
                    selectedSentence === i ? "bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedSentence(selectedSentence === i ? null : i)}
                >
                  <p className="text-base leading-relaxed">{s.text}</p>
                  {s.cn && (
                    <p className="text-sm text-muted-foreground mt-1">{s.cn}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
