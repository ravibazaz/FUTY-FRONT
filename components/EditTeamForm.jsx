"use client";

import { updateTeam } from "@/actions/teamsActions";
import { TeamSchema } from "@/lib/validation/teams";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef, useEffect } from "react";
import Image from "next/image";
import ClubDropdown from "@/components/ClubDropdown";
import GroundDropdown from "@/components/GroundDropdown";
import Link from "next/link";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Editing" : "Edit Team"}></input>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/teams" >Back</Link>
    </>
  );
}

export default function EditTeamForm({ team }) {

  const [clubId, setClubId] = useState(team.club ? team.club : '');
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedage, setSelectedAge] = useState(team.age_groups ? team.age_groups : '');
  useEffect(() => {
    if (!clubId) {
      setAgeGroups([]);
      return;

    }
    //console.log("Fetching age groups for:", leagueId);

    fetch(`/api/clubs/age-groups?clubid=${clubId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Age groups received:", data.clubs.age_groups);
        if (data.clubs.age_groups)
          setAgeGroups(data.clubs.age_groups);
        else
          setAgeGroups([]);

      })
      .catch(err => console.error(err));
  }, [clubId]);


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
    updateTeam.bind(null, team._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(team.image ? '/api' + team.image : '/images/profile-picture.jpg');
  // const [preview, setPreview] = useState([]);
  // if (team.images)
  // setPreview(team.images);
  // const arrayLength = team.images;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    const imageFile = e.target.image.files[0];
    if (imageFile) {
      formData.set("image", imageFile); // Append the new file
    } else {
      formData.delete("image"); // Remove the image key if no new file is uploaded
    }

    const result = TeamSchema(true).safeParse(
      Object.fromEntries(formData.entries())
    );

    //console.log(result);

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
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">{'> Teams'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            {/* <a className="btn btn-common" href="teams-new.php">New</a> */}
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
            <h1 className="page-title">Edit Teams</h1>
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
                          <input className="form-control" name="name" defaultValue={team.name} type="text"></input>
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

                <ClubDropdown clienterror={clientErrors.club} club={team.club} onClubChange={setClubId}></ClubDropdown>

                {ageGroups.length > 0 &&
                  <div className="left-info-box">
                    <div className="left-row row">
                      <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                        <div className="label-text">
                          <p className="mb-0">Age Grouup</p>
                        </div>
                      </div>
                      <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                        <div className="info-text px-0">
                          <p className="mb-0">
                            <select defaultValue={selectedage}
                              className="form-control"
                              name="age_groups"
                            >
                              <option value="">Choose a Age</option>
                              {ageGroups.map((agegroup) => (
                                <option key={agegroup._id} value={agegroup._id}>
                                  {agegroup.age_group}
                                </option>
                              ))}
                            </select>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <GroundDropdown clienterror={clientErrors.ground} ground={team.ground}></GroundDropdown>
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
                            <input className="form-control" name="shirt" defaultValue={team.shirt} type="text"></input>
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
                            <input className="form-control" name="shorts" defaultValue={team.shorts} type="text"></input>
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
                            <input className="form-control" name="socks" defaultValue={team.socks} type="text"></input>
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
                          <input className="form-control" name="attack" defaultValue={team.attack} type="text"></input>
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
                          <input className="form-control" name="midfield" defaultValue={team.midfield} type="text"></input>
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
                          <input className="form-control" name="defence" defaultValue={team.defence} type="text"></input>
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
                          <input className="form-control" name="email" defaultValue={team.email} type="email"></input>
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
                        <p className="mb-0">Telephone</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="phone" defaultValue={team.phone} type="text"></input>
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
                          <div className="upload-box" id="uploadBox" onClick={handleUploadClick}>
                            <Image
                              src={preview}
                              width={82}
                              height={82}
                              alt="Profile Image"
                            />
                            <input type="file" id="fileInput"
                              accept="image/*"
                              ref={fileInputRef}
                              name="image"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            ></input>
                            <p className="inputPlaceholder" id="placeholderText">Profile image</p>
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


    </>

  );
}
