"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition, useEffect } from "react";
import { createAdverts } from "@/actions/advertsActions";
import { AdvertsSchema } from "@/lib/validation/adverts";
import Image from "next/image";
import Link from "next/link";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Adding" : "Submit"}></input>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/adverts" >Back</Link>
    </>

  );
}
export default function NewGroundPage() {
  const [state, formAction] = useActionState(createAdverts, {
    success: null,
    errors: {},
  });

  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState("/images/club-badge.jpg");
  const fileInputRef = useRef(null);
  const previewsRef = useRef(null);
  const selectRef = useRef(null);
  const tomSelectRef = useRef(null);
  const [categories, setCategories] = useState([]);


  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);

      } catch (error) {
        console.error("Error fetching Caegory:", error);
      }
    };
    fetchCategories();
  }, []);


  // Initialize Tom Select after type are loaded
  useEffect(() => {
    //console.log(categories);
    if (!selectRef.current || categories.length === 0) return;
    // Destroy any previous instance
    if (tomSelectRef.current) {
      tomSelectRef.current.destroy();
      tomSelectRef.current = null;
    }
    // Initialize Tom Select
    tomSelectRef.current = new TomSelect(selectRef.current, {
      create: false,
      placeholder: "Choose a Category",
      sortField: { field: "text", direction: "asc" },

    });

    // Cleanup
    return () => {
      tomSelectRef.current?.destroy();
      tomSelectRef.current = null;
    };
  }, [categories]);


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

    const result = AdvertsSchema(false).safeParse(raw);

    //console.log(result.error);


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
            <p className="top-breadcrumb mb-0">{'> Adverts'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            {/* <a className="btn btn-common" href="#">New</a> */}
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
            <h1 className="page-title">Add New Advert</h1>

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
                        <p className="mb-0">Advert Title</p>
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


                <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text">
                        <p className="mb-0">Link</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="link" type="text"></input>
                          {state.errors?.link && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.link}</span>
                          )}
                          {clientErrors.link && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.link}</span>
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
                        <p className="mb-0">Description</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <textarea className="form-control" name="content"></textarea>

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
                        <p className="mb-0">Start Date</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="date" type="date"></input>
                          {state.errors?.date && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.date}</span>
                          )}
                          {clientErrors.date && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.date}</span>
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
                        <p className="mb-0">Start Time</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="time" type="time"></input>
                          {state.errors?.time && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.time}</span>
                          )}
                          {clientErrors.time && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.time}</span>
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
                        <p className="mb-0">End Date</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="end_date" type="date"></input>
                          {state.errors?.end_date && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.end_date}</span>
                          )}
                          {clientErrors.end_date && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.end_date}</span>
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
                        <p className="mb-0">End Time</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="end_time" type="time"></input>
                          {state.errors?.end_time && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.end_time}</span>
                          )}
                          {clientErrors.end_time && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.end_time}</span>
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
                        <p className="mb-0">Pages</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <div className="mb-0">
                          <div className="form-check" key={1}>
                            <input className="form-check-input" name="pages"
                              type="checkbox" value={'Manager'} ></input>
                            <label className="form-check-label">
                              Manager
                            </label>
                          </div>
                          <div className="form-check" key={2}>
                            <input className="form-check-input" name="pages"
                              type="checkbox" value={'Friendly'} ></input>
                            <label className="form-check-label">
                              Friendly
                            </label>
                          </div>
                          <div className="form-check" key={3}>
                            <input className="form-check-input" name="pages"
                              type="checkbox" value={'Home'} ></input>
                            <label className="form-check-label">
                              Home
                            </label>
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
                        <p className="mb-0">Advert image</p>
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
                              name="image"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            ></input>
                            <p className="inputPlaceholder" id="placeholderText">Advert Badge</p>
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
