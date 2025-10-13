"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition } from "react";
import { createTeam } from "@/actions/teamsActions";
import { TeamSchema } from "@/lib/validation/teams";
import Image from "next/image";
import ClubDropdown from "@/components/ClubDropdown";
import ManagerDropdown from "@/components/ManagerDropdown";
import LeagueDropdown from "@/components/LeagueDropdown";
import GroundDropdown from "@/components/GroundDropdown";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Adding" : "Save"}></input>
  );
}
export default function NewGroundPage() {
  const [state, formAction] = useActionState(createTeam, {
    success: null,
    errors: {},
  });

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState("/images/club-badge.jpg");
  const fileInputRef = useRef(null);
  const previewsRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());
    //console.log(raw);
    //return false;

    const result = TeamSchema(false).safeParse(raw);


    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }
    // 3️⃣ If all good, submit to main API
    setClientErrors({});

    startTransition(() => {
      formAction(formData);
    });

  };

  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">{'> Teams'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            <a className="btn btn-common" href="clubs-new.php">New</a>
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
            <h1 className="page-title">Add New Teams</h1>

          </div>
        </div>

        <form action={formAction} onSubmit={handleSubmit}>
          <div className="body-main-cont">
            <div className="single-body-row row">
              <div className="single-body-left col-lg-12 col-xl-7">

                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text">
                        <p className="mb-0">Team Name</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="name" type="text"></input>
                          {state.errors?.name && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.name}</span>
                          )}
                          {clientErrors.name && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.name}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <ManagerDropdown clienterror={clientErrors.manager}  ></ManagerDropdown>
                <ClubDropdown clienterror={clientErrors.club}></ClubDropdown>
                <LeagueDropdown clienterror={clientErrors.league} ></LeagueDropdown>
                <GroundDropdown clienterror={clientErrors.ground}></GroundDropdown>
                <div className="left-info-box-group">
                  <div className="left-info-box">
                    <div className="left-row row">
                      <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                        <div className="label-text mb-0 pb-0">
                          <p className="fw-bold mb-0">Home Kit</p>
                        </div>
                      </div>
                      <div className="left-info-col col-md-7 col-lg-8 col-xl-8">

                      </div>
                    </div>
                  </div>
                  <div className="left-info-box">
                    <div className="left-row row">
                      <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                        <div className="label-text mb-0 pt-0">
                          <p className="mb-0">Shirt:</p>
                        </div>
                      </div>
                      <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                        <div className="info-text px-0 pt-0">
                          <p className="mb-0">
                            <input className="form-control" name="shirt" type="text"></input>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="left-info-box">
                    <div className="left-row row">
                      <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                        <div className="label-text mb-0 pt-0">
                          <p className="mb-0">Shorts:</p>
                        </div>
                      </div>
                      <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                        <div className="info-text px-0 pt-0">
                          <p className="mb-0">
                            <input className="form-control" name="shorts" type="text"></input>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="left-info-box">
                    <div className="left-row row">
                      <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                        <div className="label-text mb-0 pt-0">
                          <p className="mb-0">Socks:</p>
                        </div>
                      </div>
                      <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                        <div className="info-text px-0 pt-0">
                          <p className="mb-0">
                            <input className="form-control" name="socks" type="text"></input>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text mb-0">
                        <p className="mb-0">Attack</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="attack" type="text"></input>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text mb-0">
                        <p className="mb-0">Midfield</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="midfield" type="text"></input>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text mb-0">
                        <p className="mb-0">Defence</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="defence" type="text"></input>
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
                          <input className="form-control" name="email" type="email"></input>
                          {state.errors?.email && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.email}</span>
                          )}
                          {clientErrors.email && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.email}</span>
                          )}
                          <span className="user-verify d-inline-block mt-10">Verify</span>
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
                          <input className="form-control" name="phone" type="text"></input>
                          {state.errors?.phone && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.phone}</span>
                          )}
                          {clientErrors.phone && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.phone}</span>
                          )}
                          <span className="user-verify d-inline-block mt-10">Verify</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text mb-0">
                        <p className="mb-0">image</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <div className="mb-0">
                          <div className="upload-box" id="uploadBox" onClick={handleUploadClick}>
                            <Image
                              src={preview}
                              width={82}
                              height={82}
                              alt="Profile Image"
                            />
                            <input type="file" id="fileInput" accept="image/*"
                              name="image"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ display: "none" }}></input>
                            <p className="inputPlaceholder" id="placeholderText">Club Badge</p>
                          </div>
                           {state.errors?.image && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.image}</span>
                          )}
                          {clientErrors.image && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.image}</span>
                          )}
                        </div>
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
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <SubmitButton />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </form>

      </main>
    </>
  );
}
