"use client";

import { updateStore } from "@/actions/storesActions";
import { StoresSchema } from "@/lib/validation/stores";
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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href={'/admin/stores'}>Back</Link>
    </>
  )

}

export default function EditStoreForm({ store }) {

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
    updateStore.bind(null, store._id),
    {
      success: null,
      errors: {},
    }
  );

  const selectRef = useRef(null);
  const tomSelectRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setselectedCategory,] = useState(store.category ? store.category : '');
  const [clientErrors, setClientErrors] = useState({});
  const [preview, setPreview] = useState(store.image ? '/api' + store.image : '/images/club-badge.jpg');

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

    // ✅ Preselect value in edit mode
    if (selectedCategory) {
      tomSelectRef.current.setValue(selectedCategory, true);
    }

    // Cleanup
    return () => {
      tomSelectRef.current?.destroy();
      tomSelectRef.current = null;
    };
  }, [categories]);

  // ✅ Keep TomSelect synced if selectedClub changes later
  useEffect(() => {
    if (tomSelectRef.current && selectedCategory) {
      tomSelectRef.current.setValue(selectedCategory, true);
    }
  }, [selectedCategory]);

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

    const result = StoresSchema(true).safeParse(
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
          <p className="top-breadcrumb mb-0">{'> Product'}</p>
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
          <h1 className="page-title">Edit Product</h1>
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
                        <input className="form-control" name="title" defaultValue={store.title} type="text" ></input>
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
                      <p className="mb-0">Product Category</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <select
                          className="form-control"
                          name="category"
                          ref={selectRef}
                          defaultValue={selectedCategory}
                        >
                          <option value="">Choose a Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.title}
                            </option>
                          ))}


                        </select>
                        {state.errors?.category && (
                          <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.category}</span>
                        )}
                        {clientErrors.category && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.category}</span>
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
                        <textarea className="form-control" defaultValue={store.content} name="content" ></textarea>
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
                    <div className="label-text">
                      <p className="mb-0">Product Price</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={store.price} name="price" type="text"></input>

                        {clientErrors.price && (
                          <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.price}</span>
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
                      <p className="mb-0">Product Discount</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={store.discount} name="discount" type="number"></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Product Shipping cost</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={store.shipping_cost} name="shipping_cost" type="number"></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="left-info-box">
                  <div className="left-row row">
                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                      <div className="label-text">
                        <p className="mb-0">Product Discount</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="discount" type="number"></input>
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}



              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Product Size</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">

                        <select
                          className="form-control"
                          name="size"
                          defaultValue={store.size}
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XLL">XLL</option>
                          <option value="XLLL">XLLL</option>
                          <option value="4XL">4XL</option>
                          <option value="5XL">5XL</option>
                        </select>

                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Product Color</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={store.color} name="color" type="text"></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Product Material</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={store.material} name="material" type="text"></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Product Code</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" defaultValue={store.product_code} name="product_code" type="text"></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Product Other Information</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <textarea className="form-control" defaultValue={store.other_product_info} name="other_product_info"></textarea>


                      </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text mb-0">
                      <p className="mb-0">Product image</p>
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
                          <p className="inputPlaceholder" id="placeholderText">Product Badge</p>
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
