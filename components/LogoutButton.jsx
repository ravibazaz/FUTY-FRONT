"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default  function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'GET' });
      router.push('/'); // Redirect without refreshing
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <Link href="#" onClick={handleLogout} className="nav-link">
      <i className="nav-icon fas fa-newspaper" />
      <p>Logout</p>
    </Link>
  );
}
