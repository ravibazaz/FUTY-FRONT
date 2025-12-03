"use client";

import { updateClub } from "@/actions/clubsActions";
import { ClubSchema } from "@/lib/validation/clubs";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef, useEffect } from "react";
import Image from "next/image";
import LeagueDropdown from "@/components/LeagueDropdown";
import Link from "next/link";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
    <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Editing" : "Save"}></input>
    <Link className="btn-common-text mt-30 mb-30 ps-3"  href="/admin/clubs" >Back</Link>
    </>
    
  );
}

export default function EditClubForm({ club }) {

  const [leagueId, setLeagueId] = useState(club.league ? club.league : '');
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedage, setSelectedAge] = useState(club.age_groups ? club.age_groups : '');
  useEffect(() => {
    if (!leagueId) {
      setAgeGroups([]);
      return;

    }
    //console.log("Fetching age groups for:", leagueId);
    fetch(`/api/leagues/age-groups?league=${leagueId}`)
      .then(res => res.json())
      .then(data => {
        // console.log("Age groups received:", data.leagues.age_groups);
        setAgeGroups(data.leagues.age_groups);


      })
      .catch(err => console.error(err));
  }, [leagueId]);

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
  const [state, formAction] = useActionState(
    updateClub.bind(null, club._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(club.image ? '/api' + club.image : '/images/club-badge.jpg');

  // if (club.images)
  // setPreview(club.images);
  // const arrayLength = club.images;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    // Check if a new image was uploaded
    const imageFile = e.target.image.files[0];
    if (imageFile) {
      formData.set("image", imageFile); // Append the new file
    } else {
      formData.delete("image"); // Remove the image key if no new file is uploaded
    }

    const result = ClubSchema(true).safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }
    setClientErrors({});
    startTransition(() => {
      formAction(formData);
    });



  };

  return (
    <main className="main-body col-md-9 col-lg-9 col-xl-10">
      <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
        <div className="top-left">
          <p className="top-breadcrumb mb-0">{'> Clubs'}</p>
        </div>
        <div className="top-right d-flex justify-content-between align-items-center gap-10">
          {/* <a className="btn btn-common" href="clubs-new.php">New</a> */}
          <a href="#">
            <img src="/images/icon-setting.svg" alt="Settings" />
          </a>
        </div>
      </div>
      <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-20">
        <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
          <h1 className="page-title">Edit Clubs</h1>
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
                      <p className="mb-0">Name</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="name" defaultValue={club.name} type="text" ></input>
                        {clientErrors.name && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.name}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Secretary Name</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={club.secretary_name} name="secretary_name" type="text" ></input>
                        {clientErrors.secretary_name && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.secretary_name}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Home Ground</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text" ></input>
                      </p>
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
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="number" ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Secretary Email</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={club.email} name="email" type="email"></input>
                        {clientErrors.email && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.email}
                          </span>
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
                      <p className="mb-0">Secretary Telephone</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="phone" defaultValue={club.phone} type="text"></input>
                        {clientErrors.phone && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.phone}
                          </span>
                        )}
                        <span className="user-verify d-inline-block mt-10">Verify</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <LeagueDropdown clienterror={clientErrors.league} onLeagueChange={setLeagueId} league={club.league}  ></LeagueDropdown>
              {ageGroups.length > 0 &&
                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text">
                        <p className="mb-0">Age Groups</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <div className="mb-0">

                          {ageGroups.map((agegroup) => (
                            <div className="form-check" key={agegroup._id}>
                              <input className="form-check-input" name="age_groups"
defaultChecked={selectedage.includes(agegroup._id)}
                                type="checkbox" value={agegroup._id} ></input>
                              <label className="form-check-label">
                                {agegroup.age_group}
                              </label>
                            </div>
                          ))}


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Club image</p>
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
                            alt="Club Badge"
                          />
                          <input type="file" id="fileInput" accept="image/*" ref={fileInputRef}
                            name="image"
                            onChange={handleFileChange}
                            style={{ display: "none" }} ></input>
                          <p className="inputPlaceholder" id="placeholderText">Club Badge</p>
                        </div>
                        {clientErrors.image && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.image}
                          </span>
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
  );
}
