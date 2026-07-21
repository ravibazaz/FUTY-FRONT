"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition } from "react";
import { createLeagues } from "@/actions/leaguesActions";
import { LeaguesSchema } from "@/lib/validation/leagues";
import Image from "next/image";
import AgeCheckbox from "@/components/AgeCheckbox";
import Link from "next/link";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <input className="btn-common-text mt-30 mb-30" disabled={pending} type="submit" value={pending ? "Adding" : "Submit"}></input>
      {/* <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/leagues" >Back</Link> */}
    </>
  );
}
export default function ImportPage() {

  const [file, setFile] = useState(null);

  async function upload() {

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/importgrounds", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    alert(JSON.stringify(data));
  }



  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">{'> Import Grounds from XLS File'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            {/* <a className="btn btn-common" href="#">Back</a> */}
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
            <h1 className="page-title">Upload Grounds from XLS File </h1>

          </div>
        </div>


        <div className="body-main-cont">
          <div className="single-body-row row">
            <div className="single-body-left col-lg-12 col-xl-7">

              <div className="left-info-box">
                <div className="left-row row">
                  <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                    <div className="label-text">
                      <p className="mb-0">Upload  File</p>
                    </div>
                  </div>
                  <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                    <div className="info-text px-0">
                      <p className="mb-0">
                        <input className="form-control" type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => setFile(e.target.files[0])} ></input>
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
                        <button  className="btn-common-text mt-30 mb-30" onClick={upload}>
                          Upload
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>


      </main>
    </>
  );
}
