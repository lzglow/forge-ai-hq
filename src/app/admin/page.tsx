"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import { MAX_SCORE } from "@/lib/quiz";
import { RefreshCw, Users, TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  score: number;
  tier: string;
  createdAt: string;
}

const TIER_COLORS: Record<string, string> = {
  "AI Explorer": "bg-slate-500",
  "AI Practitioner": "bg-blue-500",
  "AI Operator": "bg-violet-500",
  "AI Commander": "bg-emerald-500",
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        headers: { "x-admin-token": t },
      });
      if (res.status === 401) {
        setError("Invalid token.");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setLeads(data.leads ?? []);
      setAuthed(true);
    } catch {
      setError("Failed to fetch leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchLeads(token);
  }

  // Tier breakdown counts
  const tierCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.tier] = (acc[l.tier] ?? 0) + 1;
    return acc;
  }, {});

  const avgScore = leads.length
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
    : 0;

  if (!authed) {
    return (
      <main className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Access</p>
              <h1 className="text-xl font-bold">Leads Dashboard</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                type="password"
                placeholder="Admin token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <Button type="submit" className="w-full font-bold uppercase tracking-wider text-xs" disabled={loading}>
                {loading ? "Checking…" : "Access Dashboard"}
              </Button>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </form>
            <p className="text-xs text-muted-foreground">
              Set <code className="bg-muted px-1 rounded">ADMIN_TOKEN</code> in your{" "}
              <code className="bg-muted px-1 rounded">.env.local</code> to enable access.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col px-6 py-12">
        <div className="max-w-4xl mx-auto w-full space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin</p>
              <h1 className="text-2xl font-bold">Leads Dashboard</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLeads(token)}
              disabled={loading}
              className="gap-2 text-xs"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border/60 bg-card p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <p className="text-xs font-medium uppercase tracking-wider">Total Leads</p>
              </div>
              <p className="text-2xl font-bold tabular-nums">{leads.length}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <p className="text-xs font-medium uppercase tracking-wider">Avg Score</p>
              </div>
              <p className="text-2xl font-bold tabular-nums">{avgScore}</p>
            </div>
            {Object.entries(tierCounts).map(([tier, count]) => (
              <div key={tier} className="rounded-lg border border-border/60 bg-card p-4 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", TIER_COLORS[tier] ?? "bg-slate-500")} />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">{tier}</p>
                </div>
                <p className="text-2xl font-bold tabular-nums">{count}</p>
              </div>
            ))}
          </div>

          {/* Leads table */}
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <div className="px-4 py-3 bg-muted/30 border-b border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Leads</p>
            </div>
            {leads.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No leads yet. Leads appear here after users submit their email on the results page.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-4 px-4 py-3">
                    <p className="flex-1 text-sm font-medium truncate">{lead.email}</p>
                    <span className="text-xs text-muted-foreground tabular-nums font-mono">
                      {lead.score}/{MAX_SCORE}
                    </span>
                    <Badge className={cn("text-xs border-0 text-white", TIER_COLORS[lead.tier] ?? "bg-slate-500")}>
                      {lead.tier}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Leads are stored in Notion (Assessment Leads DB). This view queries that database directly.
          </p>
        </div>
      </div>
    </main>
  );
}
