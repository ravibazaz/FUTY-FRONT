import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import { z } from "zod";
import PlayerInvitatins from "@/lib/models/PlayerInvitatins";
export const InvitationSchema = z.object({
  player_email: z.string().nonempty("Email is required").email("Invalid email format"),
  player_name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 character"),
  player_nick_name: z.string().nonempty("Nick name is required").min(2, "Nick name must be at least 2 character"),
  player_phone: z.string().nonempty("Telephone is required").min(2, "Telephone must be at least 2 character"),
});

export async function POST(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const data = await req.json();
  const player_name = data.player_name;
  const player_email = data.player_email;
  const result = InvitationSchema.safeParse(data);

  if (!result.success) {
    // Flatten errors to match your desired response structure
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        success: false,
        message: Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value[0]])
        ),
      },
      { status: 200 }
    );
  }
  try {

    const uniqueId = `${Date.now()}`;
    console.log("Unique ID:", uniqueId);


    const message = `<p>Manager ${user.name}, invited you for joining in FUTY. Please check the invitation code below. Do not share this code to anyone!</p><p>invitatin Code : ${uniqueId}</p>`;
    const subject = "invitation Code";
    const res2 = await fetch(process.env.BREVO_REST_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_MAIL_FROM, name: process.env.MAIL_FROM_NAME },
        to: [{ email: player_email }],
        subject: subject,
        htmlContent: `<p>${message}</p>`,
      }),
    });
    const emailcheck = await res2.json();

    //console.log(emailcheck);

    if (!emailcheck.messageId) {
      throw new Error(emailcheck.message || "Failed to send email");
    }
    await connectDB();
    await PlayerInvitatins.create({
      ...data,
      player_invitation_code: uniqueId,
      manager_id: user._id
    });

    return NextResponse.json({
      success: true,
      data: {
        'invitation Code': uniqueId
      },
      message: "Invitation mail has been sent successfully",
    });

    // return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }


}
