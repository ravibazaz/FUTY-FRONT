import { connectDB } from "@/lib/db";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";
import crypto from "crypto";
import { NextResponse } from "next/server";


// Tell Next.js this should use Node runtime
export const runtime = "nodejs";

export async function POST(req) {

    try {
        // 1) Read raw body as text
        const rawBody = await req.text();
        // 2) Get signature sent from Dojo
        const signatureHeader = req.headers.get("dojo-signature");
        if (!signatureHeader) {
            console.error("Missing dojo-signature header");
            return NextResponse.json({ error: "Missing signature" }, { status: 200 });
        }

        // 3) Compute HMAC using your webhook secret (store in env variable)
        //    Dojo docs show the header is sha256=... :contentReference[oaicite:4]{index=4}
        const secret = process.env.DOJO_WEBHOOK_SECRET;
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(rawBody, "utf8");
        const expectedSignature = `sha256=${hmac.digest("hex")}`;

        // 4) Verify signature matches
        if (!crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signatureHeader)
        )) {
            console.error("Webhook signature mismatch");
             return NextResponse.json({ error: "Invalid signature" }, { status: 200 });
        }
        // 5) Parse JSON after verifying
        const event = JSON.parse(rawBody);
        // 6) Handle different webhook event types
        switch (event.event) {
            case "payment_intent.status_updated":
                {
                    const status = event.data.paymentStatus;
                    const paymentId = event.data.paymentIntentId;
                    console.log("Payment status updated:", paymentId, status);
                    // TODO: update your DB order status here
                }
                break;

            case "payment_intent.created":
                console.log("New payment intent:", event.data.paymentIntentId);
                break;

            default:
                console.log("Unhandled Dojo event:", event.event);
        }

        // 7) Return success (any 2xx accepted by Dojo)
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("Webhook handler error:", err);
        //return NextResponse.json({ error: "Server error" }, { status: 500 });
    }



}
