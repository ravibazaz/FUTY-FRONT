import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, currency, metadata } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,               // in paise for INR (₹100 → 10000)
      currency,             // "inr"
      metadata: metadata || {},
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
