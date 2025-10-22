"use client";

import { updateLeague } from "@/actions/leaguesActions";
import { LeaguesSchema } from "@/lib/validation/leagues";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef } from "react";
import Image from "next/image";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Editing" : "Edit League"}></input>
  );
}

export default function EditLeagueForm({ league }) {

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
    updateLeague.bind(null, league._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(league.image ? '/api'+league.image : '/images/club-badge.jpg');

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

    const result = LeaguesSchema(true).safeParse(
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
          <p className="top-breadcrumb mb-0">{'> League'}</p>
        </div>
        <div className="top-right d-flex justify-content-between align-items-center gap-10">
          <a className="btn btn-common" href="clubs-new.php">New</a>
          <a href="#">
            <img src="/images/icon-setting.svg" alt="Settings" />
          </a>
        </div>
      </div>
      <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-20">
        <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
          <h1 className="page-title">Edit Leagues</h1>
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
                      <p className="mb-0">Title</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="title" defaultValue={league.title} type="text" ></input>
                        {clientErrors.title && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.title}
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
                      <p className="mb-0">Descripton</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <textarea className="form-control" defaultValue={league.content} name="content" ></textarea>
                        {clientErrors.content && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.content}
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
                      <p className="mb-0">League image</p>
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
                          <p className="inputPlaceholder" id="placeholderText">League Badge</p>
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
