"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition } from "react";
import { createManagers } from "@/actions/managersActions";
import { ManagersSchema } from "@/lib/validation/managers";
import Image from "next/image";
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn-common-text" disabled={pending}>
            {pending ? "Adding" : "Save"}
        </button>
    );
}
export default function NewFanPage() {
    const [state, formAction] = useActionState(createManagers, {
        success: null,
        errors: {},
    });

    const [clientErrors, setClientErrors] = useState({});
    const [preview, setPreview] = useState("/images/profile-picture.jpg");
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

    const [isPending, startTransition] = useTransition();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const raw = Object.fromEntries(formData.entries());

        const result = ManagersSchema(false).safeParse(raw);

        if (!result.success) {
            setClientErrors(result.error.flatten().fieldErrors);
            return;
        }

        // 2️⃣ Async unique email check before submitting
        const res = await fetch(`/api/check-email?email=${raw.email}`);
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
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Managers'}</p>
                    </div>
                    <div className="top-right d-flex justify-content-between align-items-center gap-10">
                        <a className="btn btn-common" href="managers-new.php">New</a>
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
                        <h1 className="page-title">Add New Manager</h1>

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
                                                    <input className="form-control" name="name" placeholder="First Name" type="text"></input>
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
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Email</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" type="email" name="email" placeholder="Email"></input>
                                                    {state.errors?.email && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.email}</span>
                                                    )}
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
                                                    <input className="form-control" name="telephone" placeholder="Telephone" type="text"></input>
                                                    {state.errors?.telephone && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.telephone}</span>
                                                    )}
                                                    {clientErrors.telephone && (
                                                        <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.telephone}</span>
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
                                                <p className="mb-0">Postcode</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" name="post_code" placeholder="Post Code" type="text"></input>
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
                                                    <input name="travel_distance" className="form-control" type="text"></input>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">League</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" type="text"></input>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Club</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" type="text"></input>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Team</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" type="text" placeholder="Search Team"></input>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
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
                                                    <textarea name="profile_description" placeholder="Profile Text" className="form-control"></textarea>
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
                                                    <input name="nick_name" placeholder="Nickname" className="form-control" type="text"></input>
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
                                                    <input name="win" className="form-control" type="text"></input>
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
                                                    <input name="style" className="form-control" type="text"></input>
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
                                                    <input name="trophy" className="form-control" type="text"></input>
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
                                                        <input type="file" id="fileInput" accept="image/*"
                                                            name="profile_image"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            style={{ display: "none" }}></input>
                                                        <p className="inputPlaceholder" id="placeholderText">Profile image</p>
                                                    </div>
                                                    {state.errors?.profile_image && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.profile_image}</span>
                                                    )}
                                                    {clientErrors.profile_image && (
                                                        <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.profile_image}</span>
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
                                                    <input className="form-control" type="password" name="password" placeholder="Password"></input>
                                                    {state.errors?.password && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.password}</span>
                                                    )}
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
        </>
    );
}
