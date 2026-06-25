import { getTier, getScorePercent, MAX_SCORE, Tier } from "@/lib/quiz";

const BASE_URL = "https://assess.aioperator.ceo";
const CURRICULUM_URL = "https://aioperator.ceo/app/curriculum";
const BRAND = "#6366f1";
const BG = "#09090b";
const CARD = "#18181b";
const BORDER = "#27272a";
const TEXT = "#fafafa";
const MUTED = "#a1a1aa";
const FOOTER_TEXT = "#71717a";

const TIER_COLORS: Record<string, string> = {
  "AI Explorer": "#71717a",
  "AI Practitioner": "#3b82f6",
  "AI Operator": "#8b5cf6",
  "AI Commander": "#10b981",
};

const TIER_NEXT: Record<string, string> = {
  "AI Explorer": "AI Practitioner",
  "AI Practitioner": "AI Operator",
  "AI Operator": "AI Commander",
  "AI Commander": "the top",
};

const TIER_CTA: Record<string, { label: string; url: string }> = {
  "AI Explorer": { label: "Start with Track 1 →", url: `${CURRICULUM_URL}?track=1` },
  "AI Practitioner": { label: "Go to Track 2 & 3 →", url: `${CURRICULUM_URL}?track=2` },
  "AI Operator": { label: "Unlock Track 4 & 5 →", url: `${CURRICULUM_URL}?track=4` },
  "AI Commander": { label: "Open the Enterprise Track →", url: `${CURRICULUM_URL}?track=5` },
};

const TIER_DAY2_TIP: Record<string, { headline: string; body: string }> = {
  "AI Explorer": {
    headline: "The smallest move that actually changes things",
    body: "Pick one task you do at least three times a week. Write a prompt for it. Save it somewhere you can find it again. That's it. You're not building a system yet — you're capturing the raw material of one. Most people never do this step, which is why most people stay stuck. You don't need a framework. You need one saved prompt.",
  },
  "AI Practitioner": {
    headline: "The thing that separates you from the next level",
    body: "You already use AI consistently. The gap isn't effort — it's that your workflows still require you to show up and prompt. This week, pick one task you do manually with AI and make it run without you. An imperfect automated workflow beats a polished manual one. The point is the thing runs when you're not watching.",
  },
  "AI Operator": {
    headline: "The move that converts personal skill into lasting infrastructure",
    body: "You've built things that work. The gap between Operator and Commander is usually this: your best systems only work because you understand them. This week, document one of your top three AI workflows as a plain-language SOP — the kind someone else could actually follow. That single act starts turning your personal capability into something your team can depend on.",
  },
  "AI Commander": {
    headline: "What good looks like at your level",
    body: "You're not adding more workflows. You're auditing the ones you have. Set a monthly AI review — even 30 minutes. Ask what's still working, what's drifted, and what should be cut. The difference between a good AI operating system and a great one isn't more tools. It's maintenance. Treat your stack like a product you're actively shipping.",
  },
};

const TIER_DAY4_MESSAGE: Record<string, { headline: string; body: string }> = {
  "AI Explorer": {
    headline: "What it actually takes to reach the next tier",
    body: "To move from Explorer to Practitioner, you need three things: a reusable prompt library (even just five prompts you use regularly), one automated workflow that runs without you, and a basic context document for your main use case. None of this requires coding. Track 1 covers all three, in order. If you do nothing else this month, do that.",
  },
  "AI Practitioner": {
    headline: "The two things that will move your score the most",
    body: "To go from Practitioner to Operator, the biggest levers are: building your first agent workflow that runs without manual prompting, and writing a full context document — your persona, your rules, your domain knowledge — that you load into every AI session. Those two changes alone shift you from consistent user to real operator.",
  },
  "AI Operator": {
    headline: "What's between you and Commander level",
    body: "To reach Commander, you need your systems to work without you — not just technically, but organizationally. That means documented SOPs someone else can follow, measurable outcomes you actually review, and at least one other person on your team running AI workflows you built. If that's not true yet, that's your gap.",
  },
  "AI Commander": {
    headline: "Where the work goes from here",
    body: "You've already built the individual operating system. The next phase is institutional — governance frameworks, org-wide AI policies, and building the kind of infrastructure that other people's workflows depend on. That's the Enterprise track. It's not about learning new tools. It's about making what you've built something that scales.",
  },
};

function header(tier: Tier): string {
  const color = TIER_COLORS[tier.name] ?? BRAND;
  return `
    <tr><td style="padding-bottom:24px;border-bottom:1px solid ${BORDER};">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td><span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">● AI Operator Platform</span></td>
          <td align="right"><span style="display:inline-block;background:${color};color:#fff;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:20px;">${tier.name}</span></td>
        </tr>
      </table>
    </td></tr>`;
}

function footer(): string {
  return `
    <tr><td style="padding-top:32px;border-top:1px solid ${BORDER};">
      <p style="margin:0 0 6px;font-size:11px;color:${FOOTER_TEXT};line-height:1.6;">
        Stop Prompting. Start Operating. —
        <a href="https://aioperator.ceo" style="color:${BRAND};text-decoration:none;">aioperator.ceo</a>
      </p>
      <p style="margin:0;font-size:10px;color:${FOOTER_TEXT};">
        You're receiving this because you took the AI Operator Assessment.
        <a href="${BASE_URL}" style="color:${FOOTER_TEXT};text-decoration:underline;">Unsubscribe</a>
      </p>
    </td></tr>`;
}

function wrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Operator Platform</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">
        ${body}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── EMAIL 1: Score Report (sent immediately) ─────────────────────────────────

export function buildScoreReport(email: string, score: number): string {
  const tier = getTier(score);
  const percent = getScorePercent(score);
  const tierColor = TIER_COLORS[tier.name] ?? BRAND;
  const cta = TIER_CTA[tier.name] ?? { label: "Open the Curriculum →", url: CURRICULUM_URL };

  // Score bar segments — 36 max, 4 pips per tier
  const barWidth = Math.round((score / MAX_SCORE) * 100);

  const body = `
    ${header(tier)}

    <tr><td style="padding:32px 0 24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">Your Assessment Result</p>
      <h1 style="margin:0 0 4px;font-size:28px;font-weight:800;color:${TEXT};letter-spacing:-0.02em;">${score} / ${MAX_SCORE}</h1>
      <p style="margin:0;font-size:14px;color:${MUTED};">${percent}% of max score</p>
    </td></tr>

    <!-- Score bar -->
    <tr><td style="padding-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="background:#27272a;border-radius:4px;height:8px;overflow:hidden;">
          <div style="width:${barWidth}%;background:${tierColor};height:8px;border-radius:4px;"></div>
        </td></tr>
      </table>
    </td></tr>

    <!-- Tier card -->
    <tr><td style="padding-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${CARD};border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
        <tr><td style="padding:4px 0 0;background:${tierColor};border-radius:8px 8px 0 0;height:4px;"></td></tr>
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${tierColor};">${tier.name}</p>
          <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:${TEXT};line-height:1.4;">${tier.tagline}</p>
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.8;">${tier.description}</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- Next step -->
    <tr><td style="padding-bottom:32px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0f172a;border:1px solid ${BRAND}33;border-radius:8px;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">Your Next Step</p>
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.8;">${tier.nextStep}</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- CTA -->
    <tr><td style="padding-bottom:32px;">
      <a href="${cta.url}" style="display:inline-block;background:${BRAND};color:#fff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-decoration:none;padding:14px 28px;border-radius:6px;">${cta.label}</a>
    </td></tr>

    <!-- Action plan upsell -->
    <tr><td style="padding-bottom:32px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${CARD};border:1px solid ${BORDER};border-radius:8px;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${TEXT};">Want a custom 30-day roadmap?</p>
          <p style="margin:0 0 14px;font-size:12px;color:${MUTED};line-height:1.7;">Your Personalized Action Plan gives you specific tasks, tools, and weekly milestones built for your exact score — not generic advice.</p>
          <a href="${BASE_URL}/action-plan?score=${score}" style="font-size:12px;color:${BRAND};text-decoration:none;font-weight:600;">Unlock Your Action Plan →</a>
        </td></tr>
      </table>
    </td></tr>

    ${footer()}`;

  return wrapper(body);
}

// ─── EMAIL 2: Day 2 drip ─────────────────────────────────────────────────────

export function buildDripDay2(score: number): string {
  const tier = getTier(score);
  const tip = TIER_DAY2_TIP[tier.name] ?? TIER_DAY2_TIP["AI Explorer"];
  const cta = TIER_CTA[tier.name] ?? { label: "Open the Curriculum →", url: CURRICULUM_URL };

  const body = `
    ${header(tier)}

    <tr><td style="padding:32px 0 24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">Day 2 · Your Operator Path</p>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:${TEXT};line-height:1.3;letter-spacing:-0.01em;">${tip.headline}</h1>
    </td></tr>

    <tr><td style="padding-bottom:28px;">
      <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.8;">${tip.body}</p>
    </td></tr>

    <tr><td style="padding-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0f172a;border:1px solid ${BRAND}33;border-radius:8px;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND};">Your Score</p>
          <p style="margin:0;font-size:13px;color:${MUTED};">You scored <strong style="color:${TEXT};">${score}/${MAX_SCORE}</strong> — ${tier.name}. One solid action this week can move that needle.</p>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding-bottom:32px;">
      <a href="${cta.url}" style="display:inline-block;background:${BRAND};color:#fff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-decoration:none;padding:14px 28px;border-radius:6px;">${cta.label}</a>
    </td></tr>

    ${footer()}`;

  return wrapper(body);
}

// ─── EMAIL 3: Day 4 drip ─────────────────────────────────────────────────────

export function buildDripDay4(score: number): string {
  const tier = getTier(score);
  const next = TIER_NEXT[tier.name] ?? "the next level";
  const msg = TIER_DAY4_MESSAGE[tier.name] ?? TIER_DAY4_MESSAGE["AI Explorer"];
  const cta = TIER_CTA[tier.name] ?? { label: "Open the Curriculum →", url: CURRICULUM_URL };

  const body = `
    ${header(tier)}

    <tr><td style="padding:32px 0 24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">Day 4 · Your Operator Path</p>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:${TEXT};line-height:1.3;letter-spacing:-0.01em;">${msg.headline}</h1>
    </td></tr>

    <tr><td style="padding-bottom:28px;">
      <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.8;">${msg.body}</p>
    </td></tr>

    <tr><td style="padding-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${CARD};border:1px solid ${BORDER};border-radius:8px;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${TEXT};">The fastest path to ${next}</p>
          <p style="margin:0;font-size:12px;color:${MUTED};line-height:1.7;">The curriculum is structured for exactly this: moving from your current tier to the next one, in the most direct line possible. No fluff, no theory — just the operating system.</p>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding-bottom:32px;">
      <a href="${cta.url}" style="display:inline-block;background:${BRAND};color:#fff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-decoration:none;padding:14px 28px;border-radius:6px;">${cta.label}</a>
    </td></tr>

    ${footer()}`;

  return wrapper(body);
}
