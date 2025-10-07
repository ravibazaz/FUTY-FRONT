import Image from "next/image";
import { cookies } from 'next/headers';
export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">Dashboard</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            <a className="btn btn-common" href="login.php">New</a>
            <a href="#">
               <Image src="/images/icon-setting.svg" width={33} height={33} alt="Settings" />
              
            </a>
          </div>
        </div>
        <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
            <h1 className="page-title">Admin Dashboard </h1>
          </div>
          <div className="card-body">
            Welcome, Admin! You can manage content from here.{userId}
          </div>
        </div>
      </main>
    </>
  );
}

// import { cookies } from 'next/headers';
// import DataTable from "@/components/DataTable";
// export default async function AdminDashboard() {
//   const cookieStore = await cookies();
//   const userId = cookieStore.get('user_id')?.value;
//    const sampleData = [
//     { name: "Player A", team: "Team X", points: 90 },
//     { name: "Player B", team: "Team Y", points: 75 },
//     { name: "Player C", team: "Team Z", points: 88 },
//   ];
//   return (
//     <>
//       <DataTable data={sampleData} />;
//     </>
//   );
// }