"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site-header";
import { getTier, getScorePercent, MAX_SCORE, TIERS } from "@/lib/quiz";
import { ArrowRight, CheckCircle, RefreshCw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

function ScoreRing({ score, max, percent }: { score: number; max: number; percent: number }) {
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * (percent / 100);
  const gap = circumference - filled;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/40"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${gap}`}
          className="text-primary transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums">{score}</span>
        <span className="text-sm text-muted-foreground font-medium">/ {max}</span>
      </div>
    </div>
  );
}

function TierLadder({ currentTierName }: { currentTierName: string }) {
  return (
    <div className="space-y-2">
      {[...TIERS].reverse().map((tier) => {
        const isActive = tier.name === currentTierName;
        return (
          <div
            key={tier.name}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 border transition-all",
              isActive
                ? "border-primary/40 bg-primary/5"
                : "border-border/40 bg-card opacity-50"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", tier.accent)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-xs font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                {tier.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{tier.tagline}</p>
            </div>
            {isActive && (
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex-shrink-0">You</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(`/dashboard?score=${score}&tier=${encodeURIComponent(tier.name)}&email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">

          {/* Score header */}
          <div className="text-center space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Assessment Score
            </p>
            <div className="flex justify-center">
              <ScoreRing score={score} max={MAX_SCORE} percent={percent} />
            </div>
            <Badge className={cn("text-xs uppercase tracking-wider px-3 py-1", tier.accent, "text-white border-0")}>
              {tier.name}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {percent}% of max score · {score} out of {MAX_SCORE} points
            </p>
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

          {/* Tier ladder */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Where you sit
            </p>
            <TierLadder currentTierName={tier.name} />
          </div>

          <Separator />

          {/* Email capture */}
          <div className="space-y-4">
            {status === "done" ? (
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-5">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Report sent. Taking you to your dashboard…</p>
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
                    We&apos;ll send a breakdown of your score, your tier, and the exact curriculum path to your next level.
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

          {/* CTAs */}
          <div className="space-y-4 pb-8">
            {/* Paywalled action plan teaser */}
            <div className="rounded-lg border border-border/60 bg-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-sm">Personalized Action Plan</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A custom 30-day roadmap built for your exact score and tier — specific tasks, tools, and milestones to reach your next level.
              </p>
              <Button
                variant="outline"
                className="gap-2 font-bold uppercase tracking-wider text-xs"
                onClick={() => router.push(`/action-plan?score=${score}`)}
              >
                Unlock Your Plan
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Curriculum CTA */}
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
