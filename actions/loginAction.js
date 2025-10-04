'use server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import User from '@/lib/models/Users';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData) {
 
  const cookieStore =  await cookies();

  const email = formData.get("email");
  const password = formData.get("password");

  await connectDB();
  const user = await User.findOne({ email:email,account_type:'Admin'});

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid email or password" };
  }

  const token = await generateToken({ email: user.email,user_id: user.id });

    // Ensure cookie is applied before redirecting
    //await new Promise((resolve) => setTimeout(resolve, 10000)); // Small delay
    
  cookieStore.set('auth_token', token, {
    path: '/',
    httpOnly: true,
    secure: false,  // Explicitly false during local testing
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24,  // 1 day
  });

  redirect("/admin/dashboard");


}