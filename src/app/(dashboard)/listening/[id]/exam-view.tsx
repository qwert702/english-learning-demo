"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface ChoiceItem {
  text: string;
  image?: string;
  answer: string;
}

interface ListenDialogItem {
  dialog: string;
  question: string;
  options: string[];
  answer: string;
}

interface MultipleChoiceItem {
  question: string;
  options: string[];
  answer: string;
}

interface FillBlankItem {
  question: string;
  answer: string;
}

interface ReadingItem {
  title: string;
  content: string;
  questions: { question: string; options: string[]; answer: string }[];
}

interface WritingItem {
  prompt: string;
  tips?: string[];
  requirements?: string[];
}

interface Section {
  id: string;
  title: string;
  type: string;
  scorePerItem: number;
  instructions?: string;
  items: any[];
}

export interface ExamData {
  sections: Section[];
}

// ─── 纯展示卡片 ─────────────────────────────────────────────

function SectionHeader({ title, instructions }: { title: string; instructions?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {instructions && <p className="text-sm text-muted-foreground mt-1">{instructions}</p>}
    </div>
  );
}

function ListenChoiceSection({ items, answers, showResults, setAnswer }: any) {
  return (
    <div className="space-y-4">
      {items.map((item: ChoiceItem, i: number) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
          {item.image && (
            <img src={item.image} alt="" className="w-24 h-24 rounded object-cover flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium mb-2">{item.text}</p>
            <div className="flex gap-2">
              {["A", "B", "C", "D"].map((opt) => {
                const isSelected = answers[`${i}`] === opt;
                const isCorrect = opt === item.answer;
                return (
                  <button
                    key={opt}
                    disabled={showResults}
                    onClick={() => setAnswer(`${i}`, opt)}
                    className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors ${
                      isSelected && showResults
                        ? isCorrect ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"
                        : isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {showResults && isSelected ? (isCorrect ? "✓" : "✗") : opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListenDialogSection({ items, answers, showResults, setAnswer }: any) {
  return (
    <div className="space-y-4">
      {items.map((item: ListenDialogItem, i: number) => (
        <div key={i} className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground mb-1">🎧 {item.dialog}</p>
          <p className="font-medium mb-2">{item.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {item.options.map((opt, oi) => {
              const label = String.fromCharCode(65 + oi);
              const isSelected = answers[`d${i}`] === label;
              const isCorrect = label === item.answer;
              const showResult = showResults && isSelected;
              return (
                <button
                  key={oi}
                  disabled={showResults}
                  onClick={() => setAnswer(`d${i}`, label)}
                  className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    isSelected && showResult
                      ? isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
                      : isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium mr-2">{label}.</span>
                  {opt}
                  {showResult && isSelected && <span className="ml-1">{isCorrect ? "✓" : "✗"}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function MultipleChoiceSection({ items, answers, showResults, setAnswer }: any) {
  return (
    <div className="space-y-4">
      {items.map((item: MultipleChoiceItem, i: number) => (
        <div key={i} className="p-4 rounded-lg border">
          <p className="font-medium mb-2">{i + 1}. {item.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {item.options.map((opt, oi) => {
              const label = String.fromCharCode(65 + oi);
              const isSelected = answers[`m${i}`] === label;
              const isCorrect = label === item.answer;
              const showResult = showResults && isSelected;
              return (
                <button
                  key={oi}
                  disabled={showResults}
                  onClick={() => setAnswer(`m${i}`, label)}
                  className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    isSelected && showResult
                      ? isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
                      : isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium mr-2">{label}.</span>
                  {opt}
                  {showResult && isSelected && <span className="ml-1">{isCorrect ? "✓" : "✗"}</span>}
                </button>
              );
            })}
          </div>
          {showResults && item.answer && (
            <p className="text-xs text-green-600 mt-1">正确答案: {item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function FillBlankSection({ items, answers, showResults, setAnswer }: any) {
  return (
    <div className="space-y-4">
      {items.map((item: FillBlankItem, i: number) => {
        const userAnswer = answers[`f${i}`] || "";
        const isCorrect = showResults && userAnswer.toLowerCase().trim() === item.answer.toLowerCase().trim();
        return (
          <div key={i} className="p-4 rounded-lg border">
            <p className="font-medium mb-2">{i + 1}. {item.question}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setAnswer(`f${i}`, e.target.value)}
              disabled={showResults}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${
                showResults ? (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : ""
              }`}
              placeholder="输入答案..."
            />
            {showResults && (
              <p className={`text-xs mt-1 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "✓ 正确" : `✗ 正确答案: ${item.answer}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReadingSection({ items }: { items: ReadingItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-lg border">
          <p className="font-bold mb-2">{item.title}</p>
          <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{item.content}</p>
          <div className="space-y-3">
            {item.questions.map((q, qi) => (
              <div key={qi}>
                <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {q.options.map((opt, oi) => {
                    const label = String.fromCharCode(65 + oi);
                    return (
                      <span key={oi} className="text-xs text-muted-foreground">
                        {label}. {opt}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-green-600 mt-1">答案: {q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WritingSection({ items }: { items: WritingItem[] }) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-lg border">
          <p className="font-medium mb-2">📝 {item.prompt}</p>
          {item.tips && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">提示：</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {item.tips.map((tip, ti) => <li key={ti}>{tip}</li>)}
              </ul>
            </div>
          )}
          {item.requirements && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">要求：</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {item.requirements.map((r, ri) => <li key={ri}>{r}</li>)}
              </ul>
            </div>
          )}
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="在此写作文..."
          />
        </div>
      ))}
    </div>
  );
}

// ─── 主组件 ────────────────────────────────────────────────

export function ExamView({ examData }: { examData: ExamData }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const setAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalPossible = examData.sections
    .filter((s) => s.type !== "writing")
    .reduce((sum, s) => {
      const items = s.items as any[];
      return sum + items.length * s.scorePerItem;
    }, 0);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.min(100, Math.round((answeredCount / (totalPossible > 0 ? totalPossible / 2 : 1)) * 100));

  const sectionComponents: Record<string, (props: any) => React.ReactNode> = {
    listen_choice: ListenChoiceSection,
    listen_dialog: ListenDialogSection,
    multiple_choice: MultipleChoiceSection,
    fill_blank: FillBlankSection,
    reading: ReadingSection,
    writing: WritingSection,
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📝 实战试卷</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{progress}% 完成</span>
          <Progress value={progress} className="w-24" />
        </div>
      </div>

      {!showResults && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} size="lg">📥 提交批改</Button>
        </div>
      )}

      {examData.sections.map((section) => {
        const SectionComponent = sectionComponents[section.type];
        if (!SectionComponent) return null;

        return (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <SectionHeader title={section.title} instructions={section.instructions} />
              {section.scorePerItem > 0 && (
                <Badge variant="outline" className="text-xs">
                  每题 {section.scorePerItem} 分
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <SectionComponent
                items={section.items}
                answers={answers}
                showResults={showResults}
                setAnswer={setAnswer}
              />
            </CardContent>
          </Card>
        );
      })}

      {showResults && (
        <div className="flex justify-center">
          <Badge className="text-base px-6 py-2">
            ✅ 已批改完成
          </Badge>
        </div>
      )}
    </div>
  );
}
