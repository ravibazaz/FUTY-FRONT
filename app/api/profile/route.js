import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from "@/lib/db";
import Notification from "@/lib/models/Notification";
import Friendlies from "@/lib/models/Friendlies";
export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  const { user } = authResult;

  await connectDB();
  const count = await Notification.countDocuments({
    userId: user._id,
    isRead: false,
  });





  const now = new Date();

  /* ======================
     TODAY RANGE
  ====================== */
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  /* ======================
     WEEK RANGE (Monday Start)
  ====================== */
  const weekStart = new Date(now);
  const day = now.getDay() || 7; // Sunday fix
  weekStart.setDate(now.getDate() - day + 1);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  /* ======================
     MONTH RANGE
  ====================== */
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const total_friendlys_crated_by_me = await Friendlies.aggregate([
    {
      $facet: {

        week: [
          {
            $match: {
              created_by_user: user._id,
              date: {
                $gte: weekStart,
                $lt: weekEnd,
              },
            },
          },
          { $count: "count" },
        ],

        month: [
          {
            $match: {
              created_by_user: user._id,
              date: {
                $gte: monthStart,
                $lt: monthEnd,
              },
            },
          },
          { $count: "count" },
        ],
        total: [
          {
            $match: {
              created_by_user: user._id,
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);
  //Accepted 
   const total_friendlys_accepted_by_me = await Friendlies.aggregate([
    {
      $facet: {

        week: [
          {
            $match: {
              accepted_by_user: user._id,
              accepteddAt: {
                $gte: weekStart,
                $lt: weekEnd,
              },
            },
          },
          { $count: "count" },
        ],

        month: [
          {
            $match: {
              accepted_by_user: user._id,
              accepteddAt: {
                $gte: monthStart,
                $lt: monthEnd,
              },
            },
          },
          { $count: "count" },
        ],
        total: [
          {
            $match: {
              accepted_by_user: user._id,
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    message: "Welcome to the profile page!",
    data: user,
    unreadcount: count,
    total_friendlys_created_by_me_in_this_week: total_friendlys_crated_by_me[0].week[0]?.count || 0,
    total_friendlys_created_by_me_in_this_month: total_friendlys_crated_by_me[0].month[0]?.count || 0,
    total_friendlys_created_by_me_yet: total_friendlys_crated_by_me[0].total[0]?.count || 0,
    total_friendlys_accepted_by_me_in_this_week: total_friendlys_accepted_by_me[0].week[0]?.count || 0,
    total_friendlys_accepted_by_me_in_this_month: total_friendlys_accepted_by_me[0].month[0]?.count || 0,
    total_friendlys_accepted_by_me_yet: total_friendlys_accepted_by_me[0].total[0]?.count || 0,
  });
}
