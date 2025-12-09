import Image from "next/image";
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Leagues from '@/lib/models/Leagues';
import Clubs from "@/lib/models/Clubs";
import Teams from "@/lib/models/Teams";
import Users from "@/lib/models/Users";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  await connectDB();

  const leagues = await Leagues.find().countDocuments();
  const clubs = await Clubs.find().countDocuments();
  const teams = await Teams.find().countDocuments();
  const mangers = await Users.find({ account_type: "Manager" }).countDocuments();
  const referee = await Users.find({ account_type: "Referee" }).countDocuments();
  const player = await Users.find({ account_type: "Player" }).countDocuments();


  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">Dashboard</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            {/* <a className="btn btn-common" href="#">New</a> */}
            <a href="#">
              <Image src="/images/icon-setting.svg" width={33} height={33} alt="Settings" />
            </a>
          </div>
        </div>
        <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
            <h1 className="page-title">Admin Dashboard </h1>
          </div>
          {/* <div className="card-body">
            Welcome, Admin! You can manage content from here.{userId}
          </div> */}
          <div className="row">
            <div className="col-sm-4 mb-2 ">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Leagues</h5>
                  <p className="card-text">{leagues}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-4 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Teams</h5>
                  <p className="card-text">{teams}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-4 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Managers</h5>
                  <p className="card-text">{mangers}</p>

                </div>
              </div>
            </div>
            <div className="col-sm-4 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Players</h5>
                  <p className="card-text">{player}</p>

                </div>
              </div>
            </div>

            <div className="col-sm-4 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Clubs</h5>
                  <p className="card-text">{clubs}</p>

                </div>
              </div>
            </div>

            <div className="col-sm-4 mb-2">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Total Referees</h5>
                  <p className="card-text">{referee}</p>

                </div>
              </div>
            </div>
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