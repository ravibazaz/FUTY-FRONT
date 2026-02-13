import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { protectApiRoute } from "@/lib/middleware";
import { z } from "zod";
import Friendlies from "@/lib/models/Friendlies";
import Users from "@/lib/models/Users";
// import { createAndSendNotification } from "@/lib/notify";
export async function POST(req) {
  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  const { user } = authResult;
  await connectDB();
  // console.log(user);

  const data = await req.json();
  const _id = data._id;
  const existing = await Users.findById(user._id);
  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        message: "User does not exists",
      },
      { status: 200 }
    );
  }

  await Friendlies.findByIdAndUpdate(_id, { accepted_by_user: user._id, status: 'Friendly Accepted' });
  const check_friendly_fcmtoken = await Friendlies.findById(_id).select("-__v").populate({
    path: "created_by_user",
    select: "name fcmtoken",
  }).lean();

  // try {
  //   if (check_friendly_fcmtoken && check_friendly_fcmtoken.created_by_user.fcmtoken)
  //     await createAndSendNotification({
  //       userId: check_friendly_fcmtoken.created_by_user._id,
  //       fcmToken: check_friendly_fcmtoken.created_by_user.fcmtoken, // stored in user table
  //       title: "Friendly",
  //       body: 'Friendly Accepted',
  //       type: "friendly",
  //       data: {
  //         user: user
  //       },
  //     });

  // } catch (error) {
  //   console.log(error);
  // }
  return NextResponse.json({
    success: true,
    message: "Friendly accepted",
  });
}
