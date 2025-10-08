import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import Image from "next/image";
export default async function ViewFansPage({ params }) {
  const id = (await params).id;
  let preview = "/images/profile-picture.jpg";
  await connectDB();
  const userdetails = await User.findById(id).lean();
  if (userdetails.profile_image)
    preview = userdetails.profile_image;

  return (

    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">{'> Fans'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            <a className="btn btn-common" href="fans-new.php">New</a>
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
            <div className="toggle-switch-cont">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked={(userdetails.isActive ? true : false)}></input>
                <span className="switch round"></span>
              </label>
              <span className="switch-label-text fs-12">{
                (userdetails.isActive ? 'Active' : 'Inactive')
              }</span>
            </div>
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
                      <p className="mb-0">Team</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text">
                      <p className="mb-0">Pegasus U14s</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      {/* <!-- <p className="mb-0"></p> --> */}
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text">
                      <p className="mb-0">
                        <a className="btn-common-text" href="fans-edit.php">Edit</a>
                        {/* <!-- <input className="btn-common-text" type="submit" value="Edit"> --> */}
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
                  <p className="mb-0 fs-14">
                    <span className="info-span">E-mail: <a className="text-decoration-none text-body underline-hover" href={userdetails.email}>{userdetails.email}</a></span>
                  </p>
                </div>
                <div className="right-info mb-30">
                  <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                    <span className="info-span">Tel: <a className="text-decoration-none text-body underline-hover" href="tel:+44 07453 234258">{userdetails.telephone}</a></span>
                    <span className="user-active">Verified</span>
                  </p>
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
                    <a className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href="fans-edit.php">Profile Image</a>
                  </p>
                </div>
                <div className="right-info">
                  <div className="form-group row">
                    <label className="form-label col-md-4 col-xl-2 col-form-label fs-14">
                      <strong className="text-start">Password</strong>
                      <p className="mt-10 mb-0"><a className="text-primary text-decoration-none underline-hover" href="fans-edit.php">Change</a></p>
                    </label>
                    <div className=" col-md-8 col-xl-10">
                      <input className="form-control" type="password" ></input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>


    </>

  )

}
