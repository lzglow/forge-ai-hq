import { NextRequest, NextResponse } from "next/server";

/**
 * Paddle webhook handler (stub — not yet wired in production).
 *
 * Setup when ready:
 * 1. In Paddle dashboard → Notifications → add endpoint:
 *    https://assess.aioperator.ceo/api/paddle-webhook
 * 2. Subscribe to: transaction.completed
 * 3. Copy the webhook secret → set as PADDLE_WEBHOOK_SECRET in .env.local + Vercel
 *
 * Signature verification: https://developer.paddle.com/webhooks/signature-verification
 */

interface PaddleWebhookPayload {
  event_type: string;
  data: {
    id: string;
    status: string;
    customer: {
      email: string;
    };
    custom_data?: {
      score?: number;
      tier?: string;
    };
    items?: Array<{
      price: { id: string };
    }>;
  };
}

export async function POST(req: NextRequest) {
  // Inert until Paddle is fully configured
  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Paddle not configured" }, { status: 503 });
  }

  // TODO: enable signature verification before going live
  // const secret = process.env.PADDLE_WEBHOOK_SECRET;
  // const signature = req.headers.get("paddle-signature") ?? "";
  // if (!verifyPaddleSignature(signature, await req.text(), secret)) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  // }

  let payload: PaddleWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (payload.event_type === "transaction.completed" && payload.data.status === "completed") {
    const email = payload.data.customer?.email;
    const score = payload.data.custom_data?.score ?? 0;
    const tier = payload.data.custom_data?.tier ?? "AI Explorer";

    if (email) {
      // TODO: log to Notion + trigger action plan delivery
      console.log(`[paddle-webhook] transaction.completed: ${email} | Tier: ${tier} | Score: ${score}`);
    }
  }

  return NextResponse.json({ received: true });
}
