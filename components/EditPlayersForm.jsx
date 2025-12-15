"use client";

import { updatePlayers } from "@/actions/playersActions";
import { PlayersSchema } from "@/lib/validation/players";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef,useEffect } from "react";
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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/players" >Back</Link>
    </>
  );
}

export default function EditPlayersForm({ user }) {

  //console.log(user);

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
    updatePlayers.bind(null, user._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const selectRef = useRef(null);
  const tomSelectRef = useRef(null);
  const [managers, setManagers] = useState([]);
  const [selectedCategory, setselectedCategory,] = useState(user.palyer_manger_id ? user.palyer_manger_id : '');
  const [preview, setPreview] = useState(user.profile_image ? '/api' + user.profile_image : '/images/profile-picture.jpg');
  // if (user.profile_image)
  // setPreview(user.profile_image);


  useEffect(() => {

    const fetchManagers = async () => {
      try {
        const response = await fetch("/api/managers");
        const data = await response.json();
        setManagers(data.managers);

      } catch (error) {
        console.error("Error fetching Manger:", error);
      }
    };
    fetchManagers();
  }, []);
  // Initialize Tom Select after type are loaded
  useEffect(() => {
    //console.log(categories);
    if (!selectRef.current || managers.length === 0) return;
    // Destroy any previous instance
    if (tomSelectRef.current) {
      tomSelectRef.current.destroy();
      tomSelectRef.current = null;
    }
    // Initialize Tom Select
    tomSelectRef.current = new TomSelect(selectRef.current, {
      create: false,
      placeholder: "Choose a Manager",
      sortField: { field: "text", direction: "asc" },

    });

    // ✅ Preselect value in edit mode
    if (selectedCategory) {
      tomSelectRef.current.setValue(selectedCategory, true);
    }

    // Cleanup
    return () => {
      tomSelectRef.current?.destroy();
      tomSelectRef.current = null;
    };
  }, [managers]);

  // ✅ Keep TomSelect synced if selectedClub changes later
  useEffect(() => {
    if (tomSelectRef.current && selectedCategory) {
      tomSelectRef.current.setValue(selectedCategory, true);
    }
  }, [selectedCategory]);



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

    const result = PlayersSchema(true).safeParse(
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
          <p className="top-breadcrumb mb-0">{'> Player'}</p>
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
          <h1 className="page-title">Edit Player</h1>
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
                      <p className="mb-0">Invited By</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <select
                          className="form-control"
                          name="palyer_manger_id"
                          ref={selectRef}
                          defaultValue={selectedCategory}
                        >
                          <option value="">Choose a Manager</option>
                          {managers.map((manager) => (
                            <option key={manager._id} value={manager._id}>
                              {manager.name}
                            </option>
                          ))}
                        </select>
                        {state.errors?.palyer_manger_id && (
                          <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.palyer_manger_id}</span>
                        )}
                        {clientErrors.palyer_manger_id && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.palyer_manger_id}</span>
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
                      <p className="mb-0">Position</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_position" defaultValue={user.palyer_position} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Pace</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_pace" defaultValue={user.palyer_pace} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Skill</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_skill" defaultValue={user.palyer_skill} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Power</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_power" defaultValue={user.palyer_power} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
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
                        <input name="palyer_defence" defaultValue={user.palyer_defence} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Teamwork</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_teamwork" defaultValue={user.palyer_teamwork} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Discipline</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_discipline" defaultValue={user.palyer_discipline} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Rating</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input name="palyer_rating" defaultValue={user.palyer_rating} className="form-control" min={0} max={100} type="number"></input>
                        <span className="d-inline-block mt-10" >(between 0 and 100)</span>
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
                      <p className="password-container mb-0">
                        <input className="form-control" name="password" placeholder="Password" type={showPassword ? "text" : "password"} ></input>
                        <span id="showPasswordImg" className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}
                          style={{ cursor: "pointer" }}>
                          <Image
                            src={showPassword ? "/images/icon-closed-eye.svg" : "/images/icon-open-eye.svg"}
                            alt={showPassword ? "Closed Eye" : "Open Eye"}
                            width={24}
                            height={24}
                          />
                        </span>
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
