"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QUESTIONS } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;
  const isLast = current === QUESTIONS.length - 1;

  function handleSelect(points: number) {
    setSelected(points);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];

    if (isLast) {
      const total = newAnswers.reduce((sum, p) => sum + p, 0);
      router.push(`/results?score=${total}`);
      return;
    }

    setAnswers(newAnswers);
    setSelected(null);
    setCurrent((c) => c + 1);
  }

  function handleBack() {
    if (current === 0) {
      router.push("/");
      return;
    }
    const prev = answers[answers.length - 1];
    setAnswers((a) => a.slice(0, -1));
    setSelected(prev ?? null);
    setCurrent((c) => c - 1);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          ● AI Operator Platform
        </span>
        <span className="text-xs text-muted-foreground">
          {current + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Progress */}
      <div className="px-6 pt-4">
        <Progress value={progress} className="h-1" />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Question {current + 1}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Answer choices */}
          <div className="space-y-3">
            {question.answers.map((answer) => (
              <button
                key={answer.points}
                onClick={() => handleSelect(answer.points)}
                className={cn(
                  "w-full text-left rounded-lg border px-5 py-4 text-sm font-medium transition-all duration-150",
                  selected === answer.points
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex-shrink-0 h-4 w-4 rounded-full border-2 transition-colors",
                      selected === answer.points
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    )}
                  />
                  {answer.label}
                </span>
              </button>
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={selected === null}
              className="gap-2 px-6 font-bold uppercase tracking-wider text-xs"
            >
              {isLast ? "See My Score" : "Next"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
