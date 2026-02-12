import Notification from "@/lib/models/Notification";
import admin from "@/lib/firebaseAdmin";

export async function createAndSendNotification({
  userId,
  fcmToken,
  title,
  body,
  type,
  data = {},
}) {
  // save in DB
  const notif = await Notification.create({
    userId,
    title,
    body,
    type,
    data,
  });

  // send push
  if (fcmToken) {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: {
        notificationId: notif._id.toString(),
        type,
        ...Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
      },
    });
  }

  return notif;
}
