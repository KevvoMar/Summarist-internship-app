import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
      // update Firestore user subscriptionPlan = "Premium"
      break;

    case "customer.subscription.deleted":
      // update Firestore user subscriptionPlan = "Basic"
      break;
  }

  return NextResponse.json({ received: true });
}