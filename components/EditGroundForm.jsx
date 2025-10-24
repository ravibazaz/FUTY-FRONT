"use client";

import { updateGround } from "@/actions/groundsActions";
import { GroundSchema } from "@/lib/validation/grounds";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition, useRef } from "react";
import Image from "next/image";
import GroundFacilitiesCheckbox from "./GroundFacilitiesCheckbox";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Editing" : "Edit Ground"}></input>
  );
}

export default function EditGroundForm({ ground }) {

  const fileInputRef = useRef(null);
  const previewsRef = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // const files = e.target.files;
    let allFiles = [];
    for (let file of e.target.files) {
      // Check for duplicate files if needed
      if (!allFiles.some(f => f.name === file.name && f.size === file.size)) {
        allFiles.push(file);
      }
    }
    previewsRef.current.innerHTML = '';
    allFiles.forEach(file => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          previewsRef.current.appendChild(img)
        }
        reader.readAsDataURL(file);
      }
    });
  };

  const [state, formAction] = useActionState(
    updateGround.bind(null, ground._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});
  // const [preview, setPreview] = useState([]);
  // if (ground.images)
  // setPreview(ground.images);
  // const arrayLength = ground.images;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());


    // Check if a new image was uploaded
    const imageFiles = e.target.images.files;
    if (imageFiles && imageFiles.length > 0) {
      console.log(imageFiles.length);
      formData.delete("images");
      for (const file of imageFiles) {
        formData.append("images", file);
      }
    } else {
      formData.delete("images"); // Remove the image key if no new file is uploaded
    }

    // console.log(formData.getAll("images"));
    // return false;
    
    const result = GroundSchema(true).safeParse(
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
                        <input className="form-control" name="name" defaultValue={ground.name} type="text" ></input>
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
                      <p className="mb-0">Address 1</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="add1" defaultValue={ground.add1} type="text" ></input>
                        {clientErrors.add1 && (
                          <span className="invalid-feedback" style={{ display: "block" }}>
                            {clientErrors.add1}
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
                      <p className="mb-0">Address 2</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="add2" defaultValue={ground.add2} type="text" ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Address 3</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" name="add3" defaultValue={ground.add3} type="text" ></input>

                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Description</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <textarea name="content" defaultValue={ground.content} className="form-control"></textarea>
                        {state.errors?.content && (
                          <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.content}</span>
                        )}
                        {clientErrors.content && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.content}</span>
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
                      <p className="mb-0">Postcode</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">

                        <input className="form-control" defaultValue={ground.pin} name="pin" type="text"></input>
                        {state.errors?.pin && (
                          <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.pin}</span>
                        )}
                        {clientErrors.pin && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.pin}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <GroundFacilitiesCheckbox facilities={ground.facilities}></GroundFacilitiesCheckbox>
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
                          <input type="file" id="fileInput"
                            accept="image/*"
                            ref={fileInputRef}
                            name="images"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            multiple></input>
                          <div className="previews" id="previews" ref={previewsRef}>

                            {ground.images.length > 0 ? (

                              ground.images.map((l, index) => (
                                <Image
                                  key={index}
                                  src={'/api'+l}
                                  width={82}
                                  height={82}
                                  alt="Profile Image"
                                  title="test2"

                                />
                              ))
                            ) : (

                              <Image
                                src={'/images/club-badge.jpg'}
                                width={82}
                                height={82}
                                alt="Profile Image"
                                title="test"

                              />
                            )}
                          </div>
                          <p className="inputPlaceholder" id="placeholderText">Ground Photos</p>
                        </div>
                        {state.errors?.images && (
                          <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.images}</span>
                        )}
                        {clientErrors.images && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.images}</span>
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
