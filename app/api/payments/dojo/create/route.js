import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";
import { protectApiRoute } from "@/lib/middleware";
import Tournaments from "@/lib/models/Tournaments";

export const runtime = "nodejs";

export async function POST(req) {

    const authResult = await protectApiRoute(req);
    // Check if the middleware returned a NextResponse object (error)
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    // Otherwise, it means the user is authenticated
    const { user } = authResult;

    try {
        //   "amount": 11000,//Ex: 10 USD. Semd 1000 (10x100), Ex: 20 USD. Semd 2000 (20x100)
        //   "currency": "usd",
        const currency = 'gbp';
        const { tournament_Id } = await req.json();
        await connectDB();

        const tournamentprice = await Tournaments.findById(tournament_Id).select("-__v").lean();
        const amount = tournamentprice.cost_per_team_entry * 100;
        
        const order = await TournamentOrderHistories.create({
            amount: amount / 100,
            currency,
            tournament_Id: tournament_Id,
            created_by_user_Id: user._id,
            status: "pending"
        });

        const dojoRes = await fetch(`${process.env.DOJO_BASE_URL}/payment-intents`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.DOJO_SECRET_KEY}`,
            },
            body: JSON.stringify({
                amount: {
                    value: amount, // Amount in minor units (e.g., 1000 for £10.00)
                    currencyCode: 'GBP',
                },
                reference: `orderId-${order._id.toString()}`,
            }),
        });

        const pi = await dojoRes.json();
        // Save PI ID in DB
        order.paymentIntentId = pi.id;
        await order.save();
        return NextResponse.json({
            success: true,
            message: "Payment Intent generated",
            data: {
                clientSecret: pi.clientSessionSecret,
                orderId: order._id,
                paymentIntentId: pi.id

            }
        });
        // return NextResponse.json(pi);
    } catch (err) {
        return Response.json({ error: err.message }, { status: 400 });
    }



}
