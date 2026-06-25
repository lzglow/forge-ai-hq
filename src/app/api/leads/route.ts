import { NextRequest, NextResponse } from "next/server";

const NOTION_API = "https://api.notion.com/v1/databases";
const NOTION_LEADS_DB = "48a9ad6e-416d-4e58-bc69-30ce6a0b70dc";

function isAuthorized(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const envToken = process.env.ADMIN_TOKEN;
  if (!envToken) return false;
  return token === envToken;
}

interface NotionPage {
  id: string;
  created_time: string;
  properties: {
    Email: { title: Array<{ text: { content: string } }> };
    Score: { number: number | null };
    Tier: { select: { name: string } | null };
  };
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Notion not configured — set NOTION_API_KEY" }, { status: 500 });
  }

  const res = await fetch(`${NOTION_API}/${NOTION_LEADS_DB}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 100,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[leads] Notion query failed:", text);
    return NextResponse.json({ error: "Failed to fetch leads from Notion" }, { status: 500 });
  }

  const data = await res.json();
  const leads = (data.results as NotionPage[]).map((page) => ({
    id: page.id,
    email: page.properties.Email.title[0]?.text.content ?? "",
    score: page.properties.Score.number ?? 0,
    tier: page.properties.Tier.select?.name ?? "Unknown",
    createdAt: page.created_time,
  }));

  return NextResponse.json({ leads, total: leads.length });
}
