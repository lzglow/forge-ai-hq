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
      { label: "Yes, for most tasks with a light review", points: 2 },
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
  {
    id: 9,
    question: "How do you stay current with new AI tools and capabilities?",
    answers: [
      { label: "I hear about things when they go viral", points: 0 },
      { label: "I follow a few newsletters or creators", points: 1 },
      { label: "I have a regular learning practice", points: 2 },
      { label: "I have a system for evaluating and integrating new tools into my stack", points: 3 },
    ],
  },
  {
    id: 10,
    question: "Have you helped anyone else on your team or in your network adopt AI?",
    answers: [
      { label: "No — I'm the only one using it", points: 0 },
      { label: "I've shared a few things informally", points: 1 },
      { label: "I've trained or helped someone implement it", points: 2 },
      { label: "I've built AI into team workflows that others depend on", points: 3 },
    ],
  },
  {
    id: 11,
    question: "Do you have a defined AI tool stack for your work?",
    answers: [
      { label: "I use whatever seems relevant at the time", points: 0 },
      { label: "I have 1–2 tools I rely on regularly", points: 1 },
      { label: "I have a defined stack for different task types", points: 2 },
      { label: "Curated stack with clear roles for each tool and regular evaluation", points: 3 },
    ],
  },
  {
    id: 12,
    question: "Can you point to specific revenue or time you've recovered because of AI?",
    answers: [
      { label: "Not really — I couldn't put a number on it", points: 0 },
      { label: "I've saved time but haven't quantified it", points: 1 },
      { label: "I have rough estimates of the value", points: 2 },
      { label: "Yes — clear numbers, and they're significant", points: 3 },
    ],
  },
];

export const MAX_SCORE = QUESTIONS.length * 3; // 36

export const TIERS: Tier[] = [
  {
    name: "AI Explorer",
    min: 0,
    max: 9,
    tagline: "The tools are there. The operating layer isn't.",
    description:
      "You're using AI when it's convenient, but there's no structure underneath — no context system, no reusable prompts, no automation running on its own. That's not a criticism; it's just where most people start. The move from here isn't learning more tools. It's building the operating layer: a context doc, a prompt library, one automated workflow. That's what shifts AI from something you use occasionally to something that actually works for you.",
    nextStep:
      "Start with Track 1 — The AI Operating System. It covers context, prompt systems, and your first automated workflow. That's the foundation. Everything else in the curriculum builds on it.",
    accent: "bg-slate-500",
  },
  {
    name: "AI Practitioner",
    min: 10,
    max: 18,
    tagline: "Your habits are good. Your systems are fragile.",
    description:
      "You use AI consistently and you have things that work. The problem is they're fragile — they depend on you remembering to prompt, staying on top of context, and managing the output yourself. The gap between Practitioner and Operator isn't effort. It's infrastructure. One automated workflow that runs without you is worth more than a dozen manual habits you have to maintain.",
    nextStep:
      "Tracks 2 and 3 — Agents & Autonomy and Context & Knowledge. Track 2 is where you build your first workflow that runs without you. Track 3 is where you build the context system that makes everything else more reliable. Do them in order.",
    accent: "bg-blue-500",
  },
  {
    name: "AI Operator",
    min: 19,
    max: 27,
    tagline: "Your systems work. Now it's about making them work for a team.",
    description:
      "You've built real things — automated workflows, a context system, documented processes. These are running, and they're saving you real time. Most people never get here. The next layer isn't more automation. It's making your systems robust enough to survive you being away, and clear enough that someone else could run them.",
    nextStep:
      "Tracks 4 and 5 — Business & Org Design and Dev Tools. Track 4 covers governance and team-level deployment. Track 5 covers the technical layer for operators who want to build their own tools. Start with whichever fits your most immediate gap.",
    accent: "bg-violet-500",
  },
  {
    name: "AI Commander",
    min: 28,
    max: 36,
    tagline: "You're not just running AI — you're building the systems others run it inside.",
    description:
      "You have the full stack: automated workflows, documented processes, measurable outcomes, and fallback systems. You know what you've built and how to evaluate it. The work at this level is institutional — governance, org-wide deployment, and teaching others to operate the way you do. The Enterprise track is where this goes.",
    nextStep:
      "The Enterprise track. You've already built the individual operating system. This track is about scaling it — policies, team rollout, org-wide governance, and building the infrastructure others work inside. Start there and fill in any gaps from earlier tracks as needed.",
    accent: "bg-emerald-500",
  },
];

export function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0];
}

export function getScorePercent(score: number): number {
  return Math.round((score / MAX_SCORE) * 100);
}
