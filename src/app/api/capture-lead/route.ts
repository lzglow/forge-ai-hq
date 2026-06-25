import { NextRequest, NextResponse } from "next/server";
import { getTier, MAX_SCORE } from "@/lib/quiz";
import { buildScoreReport, buildDripDay2, buildDripDay4 } from "@/lib/email-templates";

// ─── Config ──────────────────────────────────────────────────────────────────

const RESEND_API = "https://api.resend.com/emails";
const NOTION_API = "https://api.notion.com/v1/pages";
const NOTION_LEADS_DB = "48a9ad6e-416d-4e58-bc69-30ce6a0b70dc"; // Assessment Leads DB
const MAX_SCORE_LOCAL = MAX_SCORE;

// FROM address: use verified domain in prod, fallback to Resend sandbox in dev
const FROM =
  process.env.EMAIL_DOMAIN_VERIFIED === "true"
    ? "AI Operator Platform <support@aioperator.ceo>"
    : "AI Operator Platform <onboarding@resend.dev>";

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: unknown): string | null {
  if (!email || typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed)) return null;
  if (trimmed.length > 254) return null; // RFC 5321 max
  return trimmed;
}

// ─── Resend helper ────────────────────────────────────────────────────────────

interface ResendPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
  scheduled_at?: string; // ISO-8601 — Resend scheduled send
}

async function sendEmail(apiKey: string, payload: ResendPayload): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text };
  }
  return { ok: true };
}

// ─── Notion helper ────────────────────────────────────────────────────────────

async function logLeadToNotion(email: string, score: number, tier: string): Promise<void> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.warn("[notion] NOTION_API_KEY not set — skipping Notion log");
    return;
  }

  const res = await fetch(NOTION_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_LEADS_DB },
      properties: {
        Email: { title: [{ text: { content: email } }] },
        Score: { number: score },
        "Max Score": { number: MAX_SCORE_LOCAL },
        Tier: { select: { name: tier } },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[notion] Failed to log lead:", text);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { score, tier } = body as Record<string, unknown>;

  // 2. Validate email
  const email = validateEmail((body as Record<string, unknown>).email);
  if (!email) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 }
    );
  }

  // 3. Check API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[capture-lead] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  // 4. Sanitize score
  const parsedScore = Math.min(Math.max(Number(score) || 0, 0), MAX_SCORE_LOCAL);
  const resolvedTier = getTier(parsedScore);
  const tierName = typeof tier === "string" ? tier : resolvedTier.name;

  // 5. Schedule drip timestamps (Resend supports scheduled_at)
  const now = new Date();
  const day2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const day4 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

  // 6. Send all three emails (score report + 2 drips)
  const [report, drip2, drip4] = await Promise.all([
    sendEmail(apiKey, {
      from: FROM,
      to: email,
      subject: `Your AI Operator Score: ${parsedScore}/${MAX_SCORE_LOCAL} — ${resolvedTier.name}`,
      html: buildScoreReport(email, parsedScore),
    }),
    sendEmail(apiKey, {
      from: FROM,
      to: email,
      subject: `One thing that will move your AI score this week`,
      html: buildDripDay2(parsedScore),
      scheduled_at: day2,
    }),
    sendEmail(apiKey, {
      from: FROM,
      to: email,
      subject: `Your path from ${resolvedTier.name} to the next tier`,
      html: buildDripDay4(parsedScore),
      scheduled_at: day4,
    }),
  ]);

  // Log failures (non-fatal — don't block the response)
  if (!report.ok) console.error("[resend] Score report failed:", report.error);
  if (!drip2.ok) console.error("[resend] Drip day-2 failed:", drip2.error);
  if (!drip4.ok) console.error("[resend] Drip day-4 failed:", drip4.error);

  // Return error if the primary email (score report) failed
  if (!report.ok) {
    return NextResponse.json({ error: "Failed to send score report. Please try again." }, { status: 500 });
  }

  // 7. Log lead to Notion — non-blocking
  logLeadToNotion(email, parsedScore, tierName).catch((err) =>
    console.error("[notion] Unexpected error:", err)
  );

  return NextResponse.json({ sent: true });
}
