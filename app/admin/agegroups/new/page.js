"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition } from "react";
import { createAgeGrouups } from "@/actions/agegroupActions";
import { AgeGroupSchema } from "@/lib/validation/agegroups";
import Image from "next/image";
import Link from "next/link";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Adding" : "Submit"}></input>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/agegroups" >Back</Link>
    </>

  );
}
export default function NewAgeGroupsPage() {
  const [state, formAction] = useActionState(createAgeGrouups, {
    success: null,
    errors: {},
  });

  const [clientErrors, setClientErrors] = useState({});

  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());
    const result = AgeGroupSchema(false).safeParse(raw);
    //console.log(result);

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
            <p className="top-breadcrumb mb-0">{'> Age Groups'}</p>
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
            <h1 className="page-title">Add New Age Group</h1>

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
                        <p className="mb-0">Age Group Title</p>
                      </div>
                    </div>
                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                      <div className="info-text px-0">
                        <p className="mb-0">
                          <input className="form-control" name="age_group" type="text"></input>
                          {state.errors?.age_group && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.age_group}</span>
                          )}
                          {clientErrors.age_group && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.age_group}</span>
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
                          <textarea className="form-control" name="description"></textarea>

                          {state.errors?.description && (
                            <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.description}</span>
                          )}
                          {clientErrors.description && (
                            <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.description}</span>
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
