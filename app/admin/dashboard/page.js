import { cookies } from 'next/headers';
export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Admin Dashboard {userId}</h3>
      </div>
      <div className="card-body">
        Welcome, Admin! You can manage content from here.
      </div>
    </div>
  );
}
