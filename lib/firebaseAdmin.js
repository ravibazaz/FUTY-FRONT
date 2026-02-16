import admin from "firebase-admin";
import serviceAccount from "@/futy-d1fc9-firebase-adminsdk-fbsvc-f64b92cf17.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
