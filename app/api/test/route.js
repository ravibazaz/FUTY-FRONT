import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, subject, message } = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: "info@makeitlive.info", name: "FUTY" },
        to: [{ email: to }],
        subject,
        htmlContent: `<p>${message}</p>`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
