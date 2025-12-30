import ChangeStatus from "@/components/ChangeStatus";
import { connectDB } from "@/lib/db";
import { formatDate } from "@/lib/formatter";
import User from "@/lib/models/Users";
import Image from "next/image";
import Link from "next/link";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import Grounds from "@/lib/models/Grounds";
import Friendlies from "@/lib/models/Friendlies";
export default async function ViewFansPage({ params }) {
  const id = (await params).id;
  let preview = "/images/profile-picture.jpg";
  await connectDB();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const userdetails = await User.findById(id).populate({
    path: "team_id",
    select: "name club",
    populate: {
      path: "club",
      model: "Clubs",
      select: "label name league", // whatever fields you want
      populate: {
        path: "league",
        model: "Leagues",
        select: "label title", // whatever fields you want
      }
    }
  }).lean();
  if (userdetails.profile_image)
    preview = '/api' + userdetails.profile_image;

  const todays_friendlies_created_me = await Friendlies.find({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    created_by_user: id

  }).sort({ date: -1 }).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").lean();

// console.log(todays_friendlies_created_me);
const archive_friendlies_created_me = await Friendlies.find({
  date: {
    $lt: todayStart
  },
  created_by_user: id
}).sort({ date: -1 }).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").lean();

return (

  <>
    <main className="main-body col-md-9 col-lg-9 col-xl-10">
      <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
        <div className="top-left">
          <p className="top-breadcrumb mb-0">{'> Managers'}</p>
        </div>
        <div className="top-right d-flex justify-content-between align-items-center gap-10">
          {/* <a className="btn btn-common" href="managers-new.php">New</a> */}
          <a href="#">
            <Image
              src="/images/icon-setting.svg"
              width={33}
              height={33}
              alt="Settings"
            />
          </a>
        </div>
      </div>
      <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-20">
        <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
          <h1 className="page-title">{userdetails.name}</h1>
          <ChangeStatus userdetails={userdetails.isActive} id={id}></ChangeStatus>
          <p className="last-activity-p mb-0">Last Activity: 12 Nov</p>

        </div>
      </div>

      <div className="body-main-cont">
        <div className="single-body-row row">
          <div className="single-body-left col-lg-12 col-xl-7">
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text">
                    <p className="mb-0">League</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.team_id?.club?.league?.title}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Club</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.team_id?.club?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Team</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.team_id?._id ? userdetails.team_id.name : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text">
                    <p className="mb-0">Number of Friendlies</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">6</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Profile Text</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.profile_description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Nickname</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.nick_name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Win %</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.playing_style?.win.percentage}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Style</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.playing_style?.style.percentage}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">
                    <p className="mb-0">Trophies Won</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">{userdetails.playing_style?.trophy.percentage}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text mb-0">

                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text">
                    <p className="mb-0">

                      <Link className="btn-common-text" href={`/admin/managers/${userdetails._id}/edit`}>Edit</Link>
                      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/managers" >Back</Link>


                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single-body-right col-lg-12 col-xl-5">
            <div className="right-info-box">
              <h2 className="info-box-title fs-14 fw-bold mb-30">Contact Details</h2>
              <div className="right-info mb-30">
                <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                  <span className="info-span">E-mail: <a className="text-decoration-none text-body underline-hover" href={'mailto:' + userdetails.email}  >{userdetails.email}</a></span>
                </p>
              </div>
              <div className="right-info mb-30">
                <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                  <span className="info-span">Tel: <a className="text-decoration-none text-body underline-hover" href={'tel:' + userdetails.telephone}>{userdetails.telephone}</a></span>
                  <span className="user-active">Verified</span>
                </p>
              </div>
              <div className="right-info mb-30">
                <p className="mb-0 fs-14 d-flex align-items-center gap-30"><span className="info-span">Postcode: {userdetails.post_code}</span></p>
              </div>
              <div className="right-info mb-30">
                <p className="mb-0 fs-14 d-flex align-items-center gap-30"><span className="info-span">Travel: 50 miles</span></p>
              </div>
              <div className="right-info mb-30">
                <a href="#">
                  <Image
                    src={preview}
                    width={82}
                    height={82}
                    alt="Profile Image"
                  />
                </a>
                <p className="mb-0">
                  <Link className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href={`/admin/managers/${userdetails._id}/edit`}>Profile Imag</Link>

                </p>
              </div>
              <div className="right-info">
                <div className="form-group row">
                  <label className="form-label col-md-4 col-xl-2 col-form-label fs-14">
                    <strong className="text-start">Password</strong>
                    <p className="mt-10 mb-0">
                      <Link className="text-primary text-decoration-none underline-hover" href={`/admin/managers/${userdetails._id}/edit`}>Change </Link>

                    </p>
                  </label>
                  <div className=" col-md-8 col-xl-10">
                    <input className="form-control" type="password" ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="single-bottom-table-cont mt-30">
          <h2 className="fs-14 fw-bold mb-20">Schedules Friendlies</h2>
          <form>

            <div className="table-responsive common-datatable">
              <table id="example" className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Opposition</th>
                    <th scope="col">Ground</th>
                    <th scope="col">Status</th>
                    <th scope="col">Opp Manager</th>
                    <th scope="col">Score</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {todays_friendlies_created_me.map((l, index) => (
                    <tr key={index}>
                      <td className="text-nowrap">{formatDate(l.date)}</td>
                      <td className="text-nowrap">{l.time}</td>
                      <td className="text-nowrap"><a href="#">CPR U14s</a></td>
                      <td className="text-nowrap"><a href="#">{l.ground_id?.name}</a></td>
                      <td className="text-nowrap">Complete</td>
                      <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                      <td className="text-nowrap">3-2</td>
                      <td className="text-nowrap">Win</td>
                      <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                    </tr>
                  )
                  )}
                </tbody>
              </table>
            </div>
          </form>
        </div>

        <div className="single-bottom-table-cont mt-30">
          <h2 className="fs-14 fw-bold mb-20">Archive</h2>
          <form>

            <div className="table-responsive common-datatable">
              <table id="example" className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Opposition</th>
                    <th scope="col">Ground</th>
                    <th scope="col">Status</th>
                    <th scope="col">Opp Manager</th>
                    <th scope="col">Score</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {archive_friendlies_created_me.map((l, index) => (
                    <tr key={index}>
                      <td className="text-nowrap">{formatDate(l.date)}</td>
                      <td className="text-nowrap">{l.time}</td>
                      <td className="text-nowrap"><a href="#">CPR U14s</a></td>
                      <td className="text-nowrap"><a href="#">{l.ground_id?.name}</a></td>
                      <td className="text-nowrap">Complete</td>
                      <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                      <td className="text-nowrap">3-2</td>
                      <td className="text-nowrap">Win</td>
                      <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                    </tr>
                  )
                  )}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>

    </main>


  </>

)

}
