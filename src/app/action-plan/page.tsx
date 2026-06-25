"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { getTier, MAX_SCORE } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { CheckCircle2, ArrowRight } from "lucide-react";

const TRIAL_FEATURES = [
  "Full access to all 5 curriculum tracks (audio, video, slides, reference)",
  "Persistent progress tracking across all episodes",
  "Completion certificates for every finished track",
  "Sprint workspace, agent roster, and context doc tools",
  "14 days. No credit card required.",
];

function ActionPlanContent() {
  const params = useSearchParams();
  const score = Math.min(Math.max(parseInt(params.get("score") ?? "0", 10), 0), MAX_SCORE);
  const tier = getTier(score);

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Start Your Trial
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              The AI Operator Curriculum
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              The structured path from where you are to full operator status — sequenced tracks,
              real workflows, and the tools to build systems that run without you.
            </p>
          </div>

          {/* Tier context */}
          {score > 0 && (
            <div className={cn("rounded-lg border border-border/60 bg-card p-4 flex items-center gap-3")}>
              <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", tier.accent)} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your starting tier</p>
                <p className="text-sm font-semibold">{tier.name} — {score}/{MAX_SCORE} points</p>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="rounded-lg border border-border/60 bg-card p-6 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What you get</p>
            <ul className="space-y-3">
              {TRIAL_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-snug">{feature}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Trial CTA */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 space-y-4 text-center">
            <div>
              <p className="text-4xl font-bold">Free</p>
              <p className="text-sm text-muted-foreground mt-1">14-day trial · no credit card required</p>
            </div>
            <Button
              size="lg"
              className="w-full gap-2 font-bold uppercase tracking-wider text-xs"
              onClick={() => window.open("https://aioperator.ceo/auth", "_blank")}
            >
              Start Free Trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Full enterprise access from day one. Downgrade or cancel any time.
            </p>
          </div>

          {/* Back link */}
          <div className="text-center space-y-2 pb-8">
            <p className="text-xs text-muted-foreground">Already have an account?</p>
            <a
              href="https://aioperator.ceo/auth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              Sign in to AI Operator &#8594;
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ActionPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading&hellip;
      </div>
    }>
      <ActionPlanContent />
    </Suspense>
  );
}
