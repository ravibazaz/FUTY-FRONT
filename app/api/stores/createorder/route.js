import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { protectApiRoute } from "@/lib/middleware";
import OrderHistories from "@/lib/models/OrderHistories";
import path from "path";
import { promises as fs } from "fs";
import Stores from "@/lib/models/Stores";
export async function POST(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }


  // Otherwise, it means the user is authenticated
  const { user } = authResult;
  const data = await req.json();
  const store = await Stores.findById(data.product_id);

  if (!store) {
    return { success: false, error: "Product not found" };
  }

  let newFileName = '';
  if (store.image) {
    const oldImagePath = path.join(process.cwd(), store.image);
    // Create a new filename (e.g., add a timestamp or suffix)
    const ext = path.extname(store.image); // .jpg, .png, etc.
    const base = path.basename(store.image, ext); // filename without extension
    const dir = path.dirname(store.image); // folder path

    const timestamp = Date.now(); // gives milliseconds since epoch
    const newFileName = `${base}-${timestamp}${ext}`;

    const newImagePath = path.join(process.cwd(), dir, newFileName);
    try {
      // Copy instead of deleting
      await fs.copyFile(oldImagePath, newImagePath);
      console.log(`Image copied to: ${newImagePath}`);
    } catch (err) {
      console.warn(`Failed to copy image: ${err.message}`);
    }
  }

  await OrderHistories.create({
    ...data,
    order_product_title: store.title,
    order_product_image: '/uploads/stores/' + newFileName,
    order_product_price: store.price,
    order_product_size: store.size,
    order_product_color: store.color,
    order_product_material: store.material,
    order_product_product_code: store.product_code,
    order_product_other_product_info: store.other_product_info,
    purchased_by: user._id
  });

  return NextResponse.json({
    success: true,
    message: "Order created successfully!",
  });
}
