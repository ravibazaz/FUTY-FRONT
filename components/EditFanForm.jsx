"use client";

import { updateFan } from "@/actions/fansActions";
import { FansSchema } from "@/lib/validation/fans";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className="btn-common-text" disabled={pending}>
        {pending ? "Editing" : "Save"}
      </button>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/fans" >Back</Link>
    </>

  );
}

export default function EditFanForm({ user }) {

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
    updateFan.bind(null, user._id),
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

    const result = FansSchema(true).safeParse(
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
          <p className="top-breadcrumb mb-0">{'> Fans'}</p>
        </div>
        <div className="top-right d-flex justify-content-between align-items-center gap-10">
          {/* <a className="btn btn-common" href="fans-new.php">New</a> */}
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
          <h1 className="page-title">Edit Fans</h1>

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
                        <input className="form-control" name="name" defaultValue={user.name} type="text"></input>
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
                        <input className="form-control" type="email" name="email" defaultValue={user.email} ></input>
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
                        <input className="form-control" type="text" name="telephone" placeholder="Telephone" defaultValue={user.telephone} ></input>
                        {clientErrors.telephone && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.telephone}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Team</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="text" placeholder="Search Team" ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
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

                        {/* <!-- Upload Box --> */}
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
                      {/* <!-- <p className="mb-0"></p> --> */}
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
