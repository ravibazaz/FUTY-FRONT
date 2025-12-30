"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { deleteRefree } from "@/actions/refereesActions";
import DeleteButton from "@/components/DeleteButton";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export default function FanTable() {
  const [referees, setReferees] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/referees");
        const result = await res.json();
        setReferees(result.referees || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }

    fetchData();

    const toastMessage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("toastMessage="));

    if (toastMessage) {
      Toast.fire({
        icon: "success",
        title: decodeURIComponent(toastMessage.split("=")[1]),
      });
      document.cookie = "toastMessage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }


  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && referees.length > 0) {
      const $ = window.$;

      // Destroy if already exists
      if ($.fn.DataTable.isDataTable("#example")) {
        $("#example").DataTable().destroy();
      }

      // Initialize new DataTable
      const table = $("#example").DataTable({
        language: { searchPlaceholder: "Search" },
        initComplete: function () {
          $(".common-datatable .dt-container .row").eq(0).addClass("row-first");
          $(".common-datatable .dt-container .row").eq(1).addClass("row-second");
          $(".common-datatable .dt-container .row").eq(2).addClass("row-third");

          $(".dt-layout-start").addClass("dt-entries-per-page").removeClass("me-auto");
          $(".dt-layout-end").addClass("dt-search-bar").removeClass("ms-auto");

          const $searchInput = $(".dt-search-bar input.form-control")
            .addClass("dt-search-fld")
            .after('<input class="btn-search-reset" type="reset" value="Reset">');

          $(document).on("click", ".btn-search-reset", function () {
            table.search("").draw();
          });
        },
      });

      // Cleanup when component unmounts
      return () => {
        if ($.fn.DataTable.isDataTable("#example")) {
          $("#example").DataTable().destroy();
        }
      };
    }
  }, [referees]);


  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">{'> Referees'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            <Link prefetch={false} className="btn btn-common" href="/admin/referees/new">New Referee</Link>
            <a href="#">
              <Image src="/images/icon-setting.svg" width={33} height={33} alt="Settings" />
            </a>
          </div>
        </div>
        <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
            <h1 className="page-title">Referees</h1>
          </div>
        </div>

        <div className="body-main-cont">

          <div className="table-responsive common-datatable">
            <table id="example" className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  {/* <th scope="col">Team</th>
                    <th scope="col">Club</th>
                    <th scope="col">League</th> */}
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Friendleys</th>
                  <th scope="col">Last Activity</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {referees.length > 0 ? (
                  referees.map((l, index) => (
                    <tr key={l._id}>
                      <td className="text-nowrap user-active">
                        <Link prefetch={false} 
                          href={`/admin/referees/${l._id}/view`}
                        >
                          {l.name}
                        </Link>
                      </td>
                      {/* <td className="text-nowrap"><a href="teams-single.php">Pegasus U14</a></td>
                        <td className="text-nowrap"><a href="clubs-single.php">Pegasus FC</a></td>
                        <td className="text-nowrap"><a href="leagues-single.php">Peter Housman</a></td> */}
                      <td className="text-nowrap"><a href="tel:+44 07453 234258">{l.telephone}</a></td>
                      <td className="text-nowrap"><a href="mailto:csb9900@gmail.com">{l.email}</a></td>
                      <td className="text-nowrap"><a href="#">6</a></td>
                      <td className="text-nowrap">1 Nov</td>
                      <td className="text-nowrap">
                        <Link prefetch={false}  className="text-green"
                          href={`/admin/referees/${l._id}/edit`}
                        >
                          Edit
                        </Link>
                        {/* SweetAlert Delete Button */}
                        <DeleteButton id={l._id} />
                        {/* Hidden Form for Server Action POST */}
                        <form
                          id={`delete-form-${l._id}`}
                          action={deleteRefree.bind(null, l._id)}
                        />

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </>
  );
}
