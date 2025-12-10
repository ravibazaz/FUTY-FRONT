import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";
import { protectApiRoute } from "@/lib/middleware";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {

    const authResult = await protectApiRoute(req);
    // Check if the middleware returned a NextResponse object (error)
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    // Otherwise, it means the user is authenticated
    const { user } = authResult;
    try {

        const { amount, currency, metadata } = await req.json();
        await connectDB();

        // Create order in DB (pending)
        const order = await TournamentOrderHistories.create({
            amount: amount/100 ,
            currency,
            tournament_Id: metadata.tournament_Id,
            created_by_user_Id: user._id,
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

        return NextResponse.json({
            success: true,
            message: "Payment Intent generated",
            data: {
                clientSecret: pi.client_secret,
                orderId: order._id
            }
        });

    } catch (err) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}
