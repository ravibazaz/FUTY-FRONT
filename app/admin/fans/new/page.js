"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { createLeagues } from "@/actions/leaguesActions";
import { LeaguesSchema } from "@/lib/validation/leagues";
import Image from "next/image";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Adding" : "Add League"}
    </button>
  );
}

export default function NewFanPage() {
  const [state, formAction] = useActionState(createLeagues, {
    success: null,
    errors: {},
  });

  const [clientErrors, setClientErrors] = useState({});

  const handleSubmit = (e) => {
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    const result = LeaguesSchema.safeParse(raw);

    if (!result.success) {
      e.preventDefault(); // prevent server call
      setClientErrors(result.error.flatten().fieldErrors);
    } else {
      setClientErrors({});
    }
  };

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
              <Image src="/images/icon-setting.svg" width={33} height={33} alt="Settings" />
            </a>
          </div>
        </div>
        <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-20">
          <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
            <h1 className="page-title">Add New Fan</h1>
          </div>
        </div>

        <div className="body-main-cont">
          <div className="single-body-row row">
            <div className="single-body-left col-lg-12 col-xl-7">
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Name</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text"></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Email</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="email"></input>
                        <span className="user-verify mt-10">Verify</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Telephone</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text"></input>
                      </p>
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
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text" placeholder="Search Team"></input>
                         <span className="invalid-feedback" style={{ display:"block" }}>fdfd</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Profile image</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <div className="mb-0">
                        <div className="upload-box" id="uploadBox">
                          <Image src="/images/profile-picture.jpg" width={82} height={82} alt="Profile Image" />
                          <input type="file" id="fileInput" accept="image/*"></input>
                          <p className="inputPlaceholder" id="placeholderText">Profile image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0 fw-bold">Password</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="password"></input>
                      </p>
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
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <a className="text-decoration-none text-green text-hover-primary" href="#">Save</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>
    </>

  );
}
