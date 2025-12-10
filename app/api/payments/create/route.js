import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { amount, currency, metadata } = await req.json();

        await connectDB();

        // Create order in DB (pending)
        const order = await TournamentOrderHistories.create({
            amount,
            currency,
            tournament_Id: metadata.tournament_Id,
            status: "pending"
        });

        // Create Stripe payment intent
        const pi = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { orderId: order._id.toString() }
        });

        // Save PI ID in DB
        order.paymentIntentId = pi.id;
        await order.save();

        return Response.json({
            clientSecret: pi.client_secret,
            orderId: order._id
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}
