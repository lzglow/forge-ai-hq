"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { getTier, MAX_SCORE } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle?: any;
  }
}

const PLAN_FEATURES = [
  "Custom 30-day milestone roadmap for your exact tier",
  "Weekly focus areas with specific tasks and tools",
  "Recommended templates, prompts, and SOPs for your level",
  "Progress tracking checklist you can copy to Notion",
  "Direct path to reaching the next tier above yours",
];

function ActionPlanContent() {
  const params = useSearchParams();
  const score = Math.min(Math.max(parseInt(params.get("score") ?? "0", 10), 0), MAX_SCORE);
  const tier = getTier(score);
  const paddleRef = useRef(false);
  const [paddleReady, setPaddleReady] = useState(false);

  // Load Paddle.js
  useEffect(() => {
    if (paddleRef.current) return;
    paddleRef.current = true;

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Setup({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
          // eventCallback: (data) => console.log("Paddle event:", data),
        });
        setPaddleReady(true);
      }
    };
    document.head.appendChild(script);
  }, []);

  function handleCheckout() {
    if (!window.Paddle || !paddleReady) {
      alert("Payment is loading. Please try again in a moment.");
      return;
    }
    window.Paddle.Checkout.open({
      items: [
        {
          priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_ACTION_PLAN ?? "",
          quantity: 1,
        },
      ],
      customData: {
        score,
        tier: tier.name,
      },
      settings: {
        displayModeTheme: "dark",
      },
    });
  }

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Personalized Plan
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Your AI Operator Action Plan
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              A custom 30-day roadmap built for your exact score and tier. Not generic advice —
              specific tasks, tools, and milestones for where you are right now.
            </p>
          </div>

          {/* Tier context */}
          {score > 0 && (
            <div className={cn("rounded-lg border border-border/60 bg-card p-4 flex items-center gap-3")}>
              <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", tier.accent)} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Built for your tier</p>
                <p className="text-sm font-semibold">{tier.name} — {score}/{MAX_SCORE} points</p>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="rounded-lg border border-border/60 bg-card p-6 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What's included</p>
            <ul className="space-y-3">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-snug">{feature}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing + CTA */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 space-y-4 text-center">
            <div>
              <p className="text-4xl font-bold">$29</p>
              <p className="text-sm text-muted-foreground mt-1">One-time · instant delivery</p>
            </div>
            <Button
              size="lg"
              className="w-full gap-2 font-bold uppercase tracking-wider text-xs"
              onClick={handleCheckout}
              disabled={!paddleReady}
            >
              <Lock className="h-3.5 w-3.5" />
              {paddleReady ? "Get My Action Plan" : "Loading payment…"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Secure checkout via Paddle. Money-back guarantee within 7 days.
            </p>
          </div>

          {/* Curriculum upsell */}
          <div className="text-center space-y-2 pb-8">
            <p className="text-xs text-muted-foreground">Want the full curriculum instead?</p>
            <a
              href="https://aioperator.ceo/app/curriculum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              Open the AI Operator Curriculum →
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
        Loading…
      </div>
    }>
      <ActionPlanContent />
    </Suspense>
  );
}
