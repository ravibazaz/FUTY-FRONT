"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import ManagerInvitations from "@/lib/models/ManagerInvitations";
import { redirect } from "next/navigation";
import { ManagersSchema } from "@/lib/validation/managersInvitation";
import path from "path";

export async function createManagers(prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const result = ManagersSchema(false).safeParse({ ...raw });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  await connectDB();
  try {
    const manager_email = raw.manager_email;

    const uniqueId = `${Date.now()}`;
    console.log("Unique ID:", uniqueId);

    const message = `<p>Admin, invited you for joining in FUTY. Please check the invitation code below. Do not share this code to anyone!</p><p>Invitation Code : ${uniqueId}</p>`;
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
        to: [{ email: manager_email }],
        subject: subject,
        htmlContent: `<p>${message}</p>`,
      }),
    });
    const emailcheck = await res2.json();
    //console.log(emailcheck);
    if (!emailcheck.messageId) {
      throw new Error(emailcheck.message || "Failed to send email");
    }

    await ManagerInvitations.create({
      ...result.data,
      user_id: userId,
      manager_invitation_code: uniqueId,
    });


    // return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    // return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }


  cookieStore.set("toastMessage", "Manager Invitation Added");
  redirect("/admin/teams/invitationmanagers");
}

export async function updateManager(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = ManagersSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, email, telephone, nick_name, post_code, profile_description, travel_distance, team_id } = result.data;
  const imageFile = formData.get("profile_image");
  const password = formData.get("password");
  const geo = await getLatLng(formData.get("post_code"));
  const win = formData.get("win");
  const style = formData.get("style");
  const trophy = formData.get("trophy");
  const playing_style = {
    win: {
      value: '',
      percentage: Number(win) || 0,
    },
    style: {
      value: '',
      percentage: Number(style) || 0,
    },
    trophy: {
      value: '',
      percentage: Number(trophy) || 0,
    },
  };


  await connectDB();
  // Find the existing league in the database
  const user = await ManagerInvitations.findById(id);

  if (!user) {
    return { success: false, error: "User not found" };
  }


  // Handle image update if a new image is uploaded
  if (imageFile && imageFile.size > 0) {
    const uploadsFolder = path.join(process.cwd(), "uploads/managers");

    // Ensure the uploads folder exists
    await fileExists(uploadsFolder);
    const imageName = `${Date.now()}_${imageFile.name}`;
    const imagePath = path.join(uploadsFolder, imageName);

    // Write image file asynchronously
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Using callback version of writeFile
    fs.writeFile(imagePath, imageBuffer, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return { success: false, error: 'Failed to save image' };
      }
      console.log('File written successfully');
    });

    // Delete the old image if it exists
    if (user.profile_image) {
      const oldImagePath = path.join(process.cwd(), user.profile_image);
      // console.log(oldImagePath);
      try {
        await fs.unlink(oldImagePath).catch((err) => {
          console.warn(`Failed to delete image: ${err.message}`);
        });

      } catch (err) {
        console.warn(`Failed to delete old image: ${err.message}`);
      }
    }

    const updateData = {
      name,
      email,
      telephone,
      nick_name,
      post_code,
      lat: geo.lat,
      long: geo.lng,
      location: {
        type: "Point",
        coordinates: [geo.lng, geo.lat], // IMPORTANT
      },
      profile_description,
      travel_distance,
      team_id,
      playing_style: playing_style,
      profile_image: `/uploads/managers/${imageName}`, // Save relative path to the image
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    // Update the league document with the new image name
    await ManagerInvitations.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
      name,
      email,
      telephone,
      nick_name,
      post_code,
      lat: geo.lat,
      long: geo.lng,
      location: {
        type: "Point",
        coordinates: [geo.lng, geo.lat], // IMPORTANT
      },
      profile_description,
      travel_distance,
      team_id,
      playing_style: playing_style,
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    // If no new image is uploaded, just update the title and isActive fields
    await ManagerInvitations.findByIdAndUpdate(id, updateData);
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Updated",
    path: "/",
  });



  redirect("/admin/invitationmanagers");
}

export async function deleteManager(id) {
  "use server";
  const cookieStore = await cookies();
  await connectDB();
  const league = await ManagerInvitations.findById(id);
  if (!league) {
    throw new Error("League not found");
  }
  await ManagerInvitations.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/teams/invitationmanagers");
}
