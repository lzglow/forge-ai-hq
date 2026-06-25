"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site-header";
import { getTier, getScorePercent, MAX_SCORE, TIERS } from "@/lib/quiz";
import { ArrowRight, Lock, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const TRACK_MAP: Record<string, string[]> = {
  "AI Explorer": [
    "Track 1 — The AI Operating System",
    "Track 2 — Agents & Autonomy (preview)",
  ],
  "AI Practitioner": [
    "Track 2 — Agents & Autonomy",
    "Track 3 — Context & Knowledge",
  ],
  "AI Operator": [
    "Track 4 — Business & Org Design",
    "Track 5 — Dev Tools for Operators",
  ],
  "AI Commander": [
    "Track 5 — Dev Tools for Operators",
    "Enterprise — Governance & Scale",
  ],
};

const MILESTONES: Record<string, { label: string; done: boolean }[]> = {
  "AI Explorer": [
    { label: "Complete the AI Readiness Assessment", done: true },
    { label: "Build your first reusable prompt library", done: false },
    { label: "Set up a context document for your core use case", done: false },
    { label: "Automate one repeating task end-to-end", done: false },
    { label: "Document that workflow so someone else could run it", done: false },
  ],
  "AI Practitioner": [
    { label: "Complete the AI Readiness Assessment", done: true },
    { label: "Build your first automated AI workflow", done: false },
    { label: "Create a full context system (persona + rules + examples)", done: false },
    { label: "Automate 3+ business tasks", done: false },
    { label: "Define quality criteria for AI output you delegate", done: false },
  ],
  "AI Operator": [
    { label: "Complete the AI Readiness Assessment", done: true },
    { label: "Audit and document all AI workflows as SOPs", done: false },
    { label: "Deploy an AI workflow your team uses daily", done: false },
    { label: "Implement fallback + validation for all critical outputs", done: false },
    { label: "Build an org-level AI governance policy", done: false },
  ],
  "AI Commander": [
    { label: "Complete the AI Readiness Assessment", done: true },
    { label: "Map your full AI infrastructure across the org", done: false },
    { label: "Establish AI review cadence (monthly metrics + retros)", done: false },
    { label: "Create a client-facing AI capability statement", done: false },
    { label: "Publish your internal AI playbook", done: false },
  ],
};

function DashboardContent() {
  const params = useSearchParams();
  const router = useRouter();

  const score = Math.min(Math.max(parseInt(params.get("score") ?? "0", 10), 0), MAX_SCORE);
  const tierName = params.get("tier") ?? "";
  const email = params.get("email") ?? "";
  const tier = getTier(score);
  const activeTierName = TIERS.find((t) => t.name === tierName)?.name ?? tier.name;
  const activeTier = getTier(score);
  const percent = getScorePercent(score);
  const tracks = TRACK_MAP[activeTierName] ?? TRACK_MAP["AI Explorer"];
  const milestones = MILESTONES[activeTierName] ?? MILESTONES["AI Explorer"];

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">

          {/* Welcome header */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Operator Dashboard
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              {email ? `Welcome, ${email.split("@")[0]}.` : "Welcome."} Here's your plan.
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <Badge className={cn("text-xs uppercase tracking-wider px-3 py-1", activeTier.accent, "text-white border-0")}>
                {activeTierName}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {score}/{MAX_SCORE} points · {percent}% of max
              </span>
            </div>
          </div>

          <Separator />

          {/* Tier summary */}
          <div className="rounded-lg border border-border/60 bg-card p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Where you are</p>
            <p className="font-semibold">{activeTier.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{activeTier.description}</p>
          </div>

          {/* Recommended tracks */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Recommended curriculum path
            </p>
            {tracks.map((track, i) => (
              <div
                key={track}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3",
                  i === 0 ? "border-primary/40 bg-primary/5" : "border-border/40 bg-card"
                )}
              >
                <span className={cn(
                  "text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {i + 1}
                </span>
                <p className="text-sm font-medium">{track}</p>
                {i === 0 && (
                  <span className="ml-auto text-xs text-primary font-bold uppercase tracking-wider">Start here</span>
                )}
              </div>
            ))}
            <a href="https://aioperator.ceo/app/curriculum" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full gap-2 font-bold uppercase tracking-wider text-xs mt-1">
                Open Full Curriculum
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          <Separator />

          {/* 30-day milestones */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your 30-day milestones
            </p>
            <div className="space-y-2">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  {m.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={cn("text-sm leading-snug", m.done ? "text-muted-foreground line-through" : "text-foreground")}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Paywall CTA — personalized action plan */}
          <div className="rounded-lg border border-border/60 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold text-sm">Unlock Your Personalized Action Plan</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A custom 30-day roadmap built for your exact score — specific tasks, tools, and weekly milestones tailored to move you from {activeTierName} to the next tier.
            </p>
            <Button
              className="gap-2 font-bold uppercase tracking-wider text-xs"
              onClick={() => router.push("/action-plan")}
            >
              Get My Action Plan
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="pb-8 text-center">
            <button
              onClick={() => router.push("/quiz")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Retake the assessment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading your dashboard…
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
