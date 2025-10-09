"use client";

import { updateGround } from "@/actions/groundsActions";
import { FansSchema } from "@/lib/validation/fans";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef } from "react";
import Image from "next/image";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-common-text" disabled={pending}>
      {pending ? "Editing" : "Edit User"}
    </button>

  );
}

export default function EditGroundForm({ ground }) {

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
    updateGround.bind(null, ground._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(ground.profile_image ? ground.profile_image : '/images/profile-picture.jpg');
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
    const res = await fetch(`/api/check-email?email=${raw.email}&id=${ground._id}`);
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
          <p className="top-breadcrumb mb-0">{'> Grounds'}</p>
        </div>
        <div className="top-right d-flex justify-content-between align-items-center gap-10">
          <a className="btn btn-common" href="grounds-new.php">New</a>
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
          <h1 className="page-title">Edit Grounds</h1>

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
                    <p className="mb-0">Address</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text px-0">
                    <p className="mb-0">
                      <textarea className="form-control"></textarea>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-info-box">
              <div className="left-row row">
                <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                  <div className="label-text">
                    <p className="mb-0">Postcode</p>
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
                  <div className="label-text mb-0">
                    <p className="mb-0">Profile image</p>
                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text px-0">
                    <div className="mb-0">

                      <div className="upload-box" id="uploadBox">
                        <input type="file" id="fileInput" accept="image/*" multiple></input>
                        <div className="previews" id="previews">
                          <img src="/images/club-badge.jpg" alt="Ground Photos" />
                          <img src="/images/club-badge.jpg" alt="Ground Photos" />
                          <img src="/images/club-badge.jpg" alt="Ground Photos" />
                        </div>
                        <p className="inputPlaceholder" id="placeholderText">Ground Photos</p>
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

                  </div>
                </div>
                <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                  <div className="info-text px-0">
                    <p className="mb-0">
                      <input className="btn-common-text mt-30 mb-30" type="submit" value="Save"></input>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
