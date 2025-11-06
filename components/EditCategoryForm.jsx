"use client";

import { updateCategory } from "@/actions/categoriesActions";
import { CategoriesSchema } from "@/lib/validation/categories";
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
      <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Editing" : "Save"}></input>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href={'/admin/categories'}>Back</Link>
    </>
  )

}

export default function EditStoreForm({ category }) {



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
    updateCategory.bind(null, category._id),
    {
      success: null,
      errors: {},
    }
  );

  const selectRef = useRef(null);
  const tomSelectRef = useRef(null);
  const [type, setType] = useState(category.parent_cat_id ? 'Sub' : 'Main');
  const [categories, setCategories] = useState([]);
  const [selectedClub, setSelectedClub] = useState(category.parent_cat_id ? category.parent_cat_id : '');
  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(category.image ? '/api' + category.image : '/images/club-badge.jpg');

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
    if (!selectRef.current || categories.length === 0) return;
    // Destroy any previous instance
    if (tomSelectRef.current) {
      tomSelectRef.current.destroy();
      tomSelectRef.current = null;
    }
    // Initialize Tom Select
    tomSelectRef.current = new TomSelect(selectRef.current, {
      create: false,
      placeholder: "Choose a Sub Category",
      sortField: { field: "text", direction: "asc" },

    });

    // ✅ Preselect value in edit mode
    if (selectedClub) {
      tomSelectRef.current.setValue(selectedClub, true);
    }

    // Cleanup
    return () => {
      tomSelectRef.current?.destroy();
      tomSelectRef.current = null;
    };
  }, [categories,type]);

  // ✅ Keep TomSelect synced if selectedClub changes later
  useEffect(() => {
    if (tomSelectRef.current && selectedClub) {
      tomSelectRef.current.setValue(selectedClub, true);
    }
  }, [selectedClub]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    // Check if a new image was uploaded
    formData.set("type", type); // Append the new file
    const imageFile = e.target.image.files[0];
    if (imageFile) {
      formData.set("image", imageFile); // Append the new file
    } else {
      formData.delete("image"); // Remove the image key if no new file is uploaded
    }

    const result = CategoriesSchema(true).safeParse(
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
          <p className="top-breadcrumb mb-0">{'> Category'}</p>
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
          <h1 className="page-title">Edit Category</h1>
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
                        <input className="form-control" name="title" defaultValue={category.title} type="text" ></input>
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
                      <p className="mb-0">Category Type</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <select
                          className="form-control"
                          name="type"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="Main">Main Category</option>
                          <option value="Sub">Sub Category</option>
                        </select>

                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {
                type == 'Sub' && <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text">
                        <p className="mb-0">Sub Category</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">

                          <select
                            className="form-control"
                            name="parent_cat_id"
                            ref={selectRef}
                            defaultValue={selectedClub}

                          >
                            <option value="">Choose a Sub Category</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.title}
                              </option>
                            ))}
                          </select>

                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }


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
                        <textarea className="form-control" defaultValue={category.content} name="content" ></textarea>
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
                      <p className="mb-0">Category image</p>
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
                          <p className="inputPlaceholder" id="placeholderText">Category Badge</p>
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
