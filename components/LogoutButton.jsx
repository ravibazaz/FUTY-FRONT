"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault(); // stop <a> default navigation
    try {
      const res = await fetch("/api/logout", { method: "GET" });

      if (!res.ok) throw new Error("Logout failed");

      // Now safely redirect on client
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (

    <li className="nav-item">
      <a className="nav-link" href="#" onClick={handleLogout} ><span className="link-text">Sign Out</span></a>
    </li>
  );
}
