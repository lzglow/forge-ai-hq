import { NextRequest, NextResponse } from "next/server";
import { getTier, getScorePercent, MAX_SCORE } from "@/lib/quiz";

const RESEND_API = "https://api.resend.com/emails";
const FROM = "AI Operator Platform <support@aioperator.ceo>";
const BASE_URL = "https://aioperator.ceo";
const BRAND = "#6366f1";

function buildScoreReport(email: string, score: number, tierName: string): string {
  const tier = getTier(score);
  const percent = getScorePercent(score);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding-bottom:32px;">
          <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">● AI Operator Platform</span>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fafafa;">Your AI Operator Score: ${score}/${MAX_SCORE}</h1>
          <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.7;">You're in the <strong style="color:#fafafa;">${tierName}</strong> tier — top ${100 - percent}% of operators.</p>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:6px;padding:20px;">
            <tr><td>
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">${tier.name}</p>
              <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#fafafa;">${tier.tagline}</p>
              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.7;">${tier.description}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid ${BRAND}33;border-radius:6px;padding:20px;">
            <tr><td>
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">Your Next Step</p>
              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.7;">${tier.nextStep}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <a href="${BASE_URL}/app/curriculum" style="display:inline-block;background:${BRAND};color:#fff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:12px 24px;border-radius:4px;">
            Open the Curriculum →
          </a>
        </td></tr>

        <tr><td style="padding-top:32px;border-top:1px solid #27272a;">
          <p style="margin:0;font-size:11px;color:#71717a;line-height:1.6;">
            Stop Prompting. Start Operating. —
            <a href="${BASE_URL}" style="color:${BRAND};text-decoration:none;">aioperator.ceo</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const { email, score, tier } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const parsedScore = Math.min(Math.max(parseInt(score, 10), 0), MAX_SCORE);
  const resolvedTier = getTier(parsedScore);

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: email,
      subject: `Your AI Operator Score: ${parsedScore}/${MAX_SCORE} — ${resolvedTier.name}`,
      html: buildScoreReport(email, parsedScore, tier ?? resolvedTier.name),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
