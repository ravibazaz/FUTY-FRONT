"use client";

import { updateManager } from "@/actions/managersActions";
import { ManagersSchema } from "@/lib/validation/managers";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.bootstrap5.css";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className="btn-common-text" disabled={pending}>
        {pending ? "Editing" : "Save"}
      </button>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/managers" >Back</Link>
    </>
  );
}

export default function EditMangerForm({ user }) {

  //console.log(user.team_id._id);

  const [teams, setTeams] = useState([]);
  useEffect(() => {

    fetch(`/api/teams`)
      .then(res => res.json())
      .then(data => {
        console.log("Teams received:", data.teams);
        setTeams(data.teams);
      })
      .catch(err => console.error(err));
  }, []);

  const [selectedClub, setSelectedClub] = useState(user.team_id?.club?.name);
  const [selectedLeague, setSelectedLeage] = useState(user.team_id?.club?.league?.title);
  const [selectedTeam, setSelectedTeam] = useState(user.team_id?._id ? user.team_id._id : '');
  const selectRef = useRef(null);
  const tomSelectRef = useRef(null);


  // Initialize Tom Select after teams are loaded
  useEffect(() => {
    if (!selectRef.current || teams.length === 0) return;

    // Destroy any previous instance
    if (tomSelectRef.current) {
      tomSelectRef.current.destroy();
      tomSelectRef.current = null;
    }

    // Initialize Tom Select
    tomSelectRef.current = new TomSelect(selectRef.current, {
      create: false,
      placeholder: "Choose a Team",
      sortField: { field: "text", direction: "asc" },
      onChange: (value) => {
        const selectedOption = selectRef.current.querySelector(`option[value="${value}"]`);
        const clubName = selectedOption.dataset.club || "";
        const leagueName = selectedOption.dataset.league || "";
        setSelectedClub(clubName);
        setSelectedLeage(leagueName);
      },
    });
    // ✅ Preselect value in edit mode
    if (selectedTeam) {
      tomSelectRef.current.setValue(selectedTeam, true);
    }


    // Cleanup
    return () => {
      tomSelectRef.current?.destroy();
      tomSelectRef.current = null;
    };
  }, [teams]);



  const fileInputRef = useRef(null);
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
    updateManager.bind(null, user._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(user.profile_image ? '/api' + user.profile_image : '/images/profile-picture.jpg');
  // if (user.profile_image)
  // setPreview(user.profile_image);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    // Check if a new image was uploaded
    const imageFile = e.target.profile_image.files[0];
    if (imageFile) {
      formData.set("profile_image", imageFile); // Append the new file
    } else {
      formData.delete("profile_image"); // Remove the image key if no new file is uploaded
    }

    const result = ManagersSchema(true).safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }

    // 2️⃣ Async unique email check before submitting
    const res = await fetch(`/api/check-email?email=${raw.email}&id=${user._id}`);
    const { exists } = await res.json();

    if (exists) {
      setClientErrors({ email: ["Email already exists"] });
      return;
    }

    // 3️⃣ If all good, submit to main API
    setClientErrors({});

    startTransition(() => {
      formAction(formData);
    });



  };

  return (
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
          <h1 className="page-title">Edit Managers</h1>
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
                        <input className="form-control" type="text" name="name" defaultValue={user.name} ></input>
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
                    <div className="label-text mb-0">
                      <p className="mb-0">Email</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="email" name="email" defaultValue={user.email}></input>
                        {clientErrors.email && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.email}</span>
                        )}
                        <span className="user-active d-inline-block mt-10">Verified</span>
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
                        <input className="form-control" type="text" name="telephone" placeholder="Telephone" defaultValue={user.telephone}></input>
                        {clientErrors.telephone && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.telephone}</span>
                        )}
                        <span className="user-active d-inline-block mt-10">Verified</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Postcode</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text" name="post_code" placeholder="Post Code" defaultValue={user.post_code}></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Travel Distance</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="travel_distance" defaultValue={user.travel_distance} type="text" ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Team</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <select
                          className="form-control"
                          name="team_id"
                          ref={selectRef}
                          defaultValue={selectedTeam} 

                        >
                          <option value="">Choose a Team</option>
                          {teams.map((team) => (
                            <option key={team._id} data-club={team.club.name} data-league={team.club.league.title} value={team._id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                        {clientErrors.team_id && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.team_id}</span>
                        )}
                      </p>
                      {selectedLeague && <p className="mb-0">League:{selectedLeague}</p>}
                      {selectedClub && <p className="mb-0">Club:{selectedClub}</p>}
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
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <textarea name="profile_description" placeholder="Profile Description" defaultValue={user.profile_description} className="form-control"></textarea>
                      </p>
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
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text" name="nick_name" placeholder="Nick Name" defaultValue={user.nick_name}></input>
                      </p>
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
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="win" defaultValue={user.playing_style?.win.percentage} type="text" ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Style %</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="style" defaultValue={user.playing_style?.style.percentage} type="text" ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Trophies %</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="trophy" defaultValue={user.playing_style?.trophy.percentage} type="text" ></input>
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
                            name="profile_image"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          ></input>
                          <p className="inputPlaceholder" id="placeholderText">Profile image</p>
                        </div>
                        {clientErrors.profile_image && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.profile_image}
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
                      <p className="mb-0 fw-bold">Password</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="password" placeholder="Password" type="password" ></input>
                        {clientErrors.password && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.password}</span>
                        )}
                      </p>
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
