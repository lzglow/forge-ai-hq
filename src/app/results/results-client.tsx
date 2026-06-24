"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getTier, getScorePercent, MAX_SCORE } from "@/lib/quiz";
import { ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResultsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const score = Math.min(Math.max(parseInt(params.get("score") ?? "0", 10), 0), MAX_SCORE);
  const tier = getTier(score);
  const percent = getScorePercent(score);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score, tier: tier.name }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border/40 px-6 py-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          ● AI Operator Platform
        </span>
      </nav>

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">

          {/* Score header */}
          <div className="text-center space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Assessment Score
            </p>
            <div className="flex items-end justify-center gap-2">
              <span className="text-7xl font-bold tabular-nums">{score}</span>
              <span className="text-2xl text-muted-foreground mb-3 font-medium">/ {MAX_SCORE}</span>
            </div>
            <Badge className={cn("text-xs uppercase tracking-wider px-3 py-1", tier.accent, "text-white border-0")}>
              {tier.name}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={percent} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">{percent}th percentile of AI operators</p>
          </div>

          <Separator />

          {/* Tier description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{tier.tagline}</h2>
            <p className="text-muted-foreground leading-relaxed">{tier.description}</p>
            <div className="rounded-lg border border-border/60 bg-card p-4 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Your Next Step</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{tier.nextStep}</p>
            </div>
          </div>

          <Separator />

          {/* Email capture */}
          <div className="space-y-4">
            {status === "done" ? (
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-5">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Report sent.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Check your inbox for your full operator report and personalized curriculum path.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Get your full operator report</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll send a breakdown of your score, your tier, and the exact curriculum path to your next level.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor="email" className="sr-only">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  <Button type="submit" disabled={status === "loading"} className="font-bold uppercase tracking-wider text-xs gap-2">
                    {status === "loading" ? "Sending…" : "Send My Report"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </form>
                {status === "error" && (
                  <p className="text-xs text-destructive">Something went wrong. Try again.</p>
                )}
                <p className="text-xs text-muted-foreground">No spam. Unsubscribe any time.</p>
              </div>
            )}
          </div>

          <Separator />

          {/* CTA to curriculum */}
          <div className="space-y-4 pb-8">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-3">
              <p className="font-semibold text-sm">Ready to level up?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The AI Operator Curriculum is the structured path from wherever you are to full operator status —
                audio, video, slides, and reference material, sequenced for shipping.
              </p>
              <a
                href="https://aioperator.ceo/app/curriculum"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2 font-bold uppercase tracking-wider text-xs">
                  Open the Curriculum
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>

            <button
              onClick={() => router.push("/quiz")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <RefreshCw className="h-3 w-3" />
              Retake the assessment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
