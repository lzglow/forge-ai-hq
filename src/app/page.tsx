import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TIERS, QUESTIONS, MAX_SCORE } from "@/lib/quiz";
import { ArrowRight, Clock, BarChart3, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border/40 px-6 py-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          ● AI Operator Platform
        </span>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 text-xs uppercase tracking-wider">
            Free Assessment
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
            Are you operating AI —{" "}
            <span className="text-primary">or just using it?</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Most people prompt. Operators build systems. Take 8 questions and find
            out exactly where you stand — and what to do next.
          </p>

          <div className="flex items-center justify-center mb-12">
            <Link href="/quiz">
              <Button size="lg" className="gap-2 text-sm font-bold uppercase tracking-wider px-8">
                Start the Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{QUESTIONS.length} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Score out of {MAX_SCORE}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>~2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers preview */}
      <section className="border-t border-border/40 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-8">
            Your result will place you in one of four tiers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-lg border border-border/60 bg-card p-4 text-center space-y-2"
              >
                <div className={`inline-block w-2 h-2 rounded-full ${tier.accent}`} />
                <p className="text-sm font-semibold">{tier.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tier.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Part of the{" "}
          <a
            href="https://aioperator.ceo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            AI Operator Platform
          </a>{" "}
          — Stop Prompting. Start Operating.
        </p>
      </footer>
    </main>
  );
}
