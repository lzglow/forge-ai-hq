export interface Answer {
  label: string;
  points: number;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface Tier {
  name: string;
  min: number;
  max: number;
  tagline: string;
  description: string;
  nextStep: string;
  accent: string; // tailwind bg class for badge
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How do you currently use AI tools in your work?",
    answers: [
      { label: "I use ChatGPT when I remember to", points: 0 },
      { label: "I have a few go-to prompts I reuse", points: 1 },
      { label: "I use AI daily across multiple tools", points: 2 },
      { label: "AI is wired into my actual workflows and processes", points: 3 },
    ],
  },
  {
    id: 2,
    question: "Have you built a workflow that runs on AI without manually prompting it each time?",
    answers: [
      { label: "No — I prompt manually every time", points: 0 },
      { label: "I've thought about it but haven't done it", points: 1 },
      { label: "I have one or two automated flows", points: 2 },
      { label: "Yes — multiple automated AI workflows running", points: 3 },
    ],
  },
  {
    id: 3,
    question: "How do you handle context when working with AI?",
    answers: [
      { label: "I start fresh every conversation", points: 0 },
      { label: "I paste some background info sometimes", points: 1 },
      { label: "I have a system prompt or context doc I reuse", points: 2 },
      { label: "I have a full context system — persona, rules, domain knowledge", points: 3 },
    ],
  },
  {
    id: 4,
    question: "Can you delegate a task to an AI agent and trust the output?",
    answers: [
      { label: "No — I redo most of what AI gives me", points: 0 },
      { label: "Sometimes, for very simple tasks", points: 1 },
      { label: "Yes, for most tasks with light review", points: 2 },
      { label: "Yes — I have quality criteria and evaluation built in", points: 3 },
    ],
  },
  {
    id: 5,
    question: "How many real business tasks have you automated with AI?",
    answers: [
      { label: "Zero", points: 0 },
      { label: "1–2 tasks", points: 1 },
      { label: "3–5 tasks", points: 2 },
      { label: "More than 5 tasks", points: 3 },
    ],
  },
  {
    id: 6,
    question: "What happens when AI tools fail or hallucinate on you?",
    answers: [
      { label: "I get frustrated and stop trusting them", points: 0 },
      { label: "I work around it manually each time", points: 1 },
      { label: "I know when to trust them and when not to", points: 2 },
      { label: "I have fallback systems and validation built in", points: 3 },
    ],
  },
  {
    id: 7,
    question: "Have you documented your AI workflows so someone else could follow them?",
    answers: [
      { label: "No documentation at all", points: 0 },
      { label: "Some informal notes", points: 1 },
      { label: "Yes — key workflows are written down", points: 2 },
      { label: "Yes — full SOPs with AI instructions and examples", points: 3 },
    ],
  },
  {
    id: 8,
    question: "Do you measure the time or money AI saves you?",
    answers: [
      { label: "No — I haven't thought about it", points: 0 },
      { label: "I have a rough sense but no numbers", points: 1 },
      { label: "I track it informally", points: 2 },
      { label: "Yes — I have actual numbers and review them", points: 3 },
    ],
  },
];

export const MAX_SCORE = QUESTIONS.length * 3; // 24

export const TIERS: Tier[] = [
  {
    name: "AI Explorer",
    min: 0,
    max: 6,
    tagline: "You're aware of AI — but mostly running on instinct.",
    description:
      "You're using AI reactively, without a system behind it. The good news: you're closer than you think. What you're missing isn't skill — it's an operating layer. The curriculum was built specifically for where you are right now.",
    nextStep: "Start with Track 1 — The AI Operating System. It's the foundation everything else plugs into.",
    accent: "bg-slate-500",
  },
  {
    name: "AI Practitioner",
    min: 7,
    max: 12,
    tagline: "You're using AI regularly — but the infrastructure isn't there yet.",
    description:
      "You've got real habits and some workflows, but they're fragile — they break when you're busy or when context changes. The gap between practitioner and operator is building the layer that runs even when you're not paying attention.",
    nextStep: "Focus on Tracks 2 and 3 — Agents & Autonomy and Context & Knowledge. That's where the leverage lives.",
    accent: "bg-blue-500",
  },
  {
    name: "AI Operator",
    min: 13,
    max: 18,
    tagline: "You're building real workflows. Now it's about scale and governance.",
    description:
      "You're already operating at a level most people haven't reached. Your systems work, your context is structured, and you have real automation running. The next layer is governance, team-level deployment, and organizational AI design.",
    nextStep: "Go straight to Tracks 4 and 5 — Business & Org Design and Dev Tools. You're ready for the advanced material.",
    accent: "bg-violet-500",
  },
  {
    name: "AI Commander",
    min: 19,
    max: 24,
    tagline: "You're operating at the top. Now you build the systems others operate inside.",
    description:
      "You have a full operating system — automated workflows, documented processes, measurable outcomes, and fallback systems. The curriculum's Enterprise track will sharpen your governance model and help you scale AI across teams and clients.",
    nextStep: "Start with Track 5 and work backwards. At your level, the gaps are usually in org design and governance, not tooling.",
    accent: "bg-emerald-500",
  },
];

export function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0];
}

export function getScorePercent(score: number): number {
  return Math.round((score / MAX_SCORE) * 100);
}
