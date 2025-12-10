import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";

export const config = {
    api: { bodyParser: false }
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
        return new Response("Webhook Error", { status: 400 });
    }

    console.log("Started",event.type);
    // Connect DB
    await connectDB();
    // ---- SUCCESS ----
    if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object;
        const orderId = pi.metadata.orderId;
        await TournamentOrderHistories.findByIdAndUpdate(orderId, {
            status: "paid"
        });
        console.log("Payment success:", orderId);
    }
    // ---- FAILED ----
    if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object;
        const orderId = pi.metadata.orderId;
        await TournamentOrderHistories.findByIdAndUpdate(orderId, {
            status: "failed"
        });
        console.log("Payment failed:", orderId);
    }
    // ---- CANCELED ----
    if (event.type === "payment_intent.canceled") {
        const pi = event.data.object;
        const orderId = pi.metadata.orderId;
        await TournamentOrderHistories.findByIdAndUpdate(orderId, {
            status: "canceled"
        });
        console.log("Payment canceled:", orderId);
    }
    // ---- PROCESSING ----
    if (event.type === "payment_intent.processing") {
        const pi = event.data.object;
        const orderId = pi.metadata.orderId;
        await TournamentOrderHistories.findByIdAndUpdate(orderId, {
            status: "processing"
        });
        console.log("Payment processing:", orderId);
    }
    return new Response("OK", { status: 200 });
}
