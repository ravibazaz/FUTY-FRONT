import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // important!
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // handle events
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;

    console.log("💰 Payment Success:", pi.id);

    // update order in DB, send email, etc.
  }

  return new Response("ok", { status: 200 });
}
