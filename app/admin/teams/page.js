"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
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

export default function GroundTable() {
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/teams");
        const result = await res.json();
        console.log(result);

        setTeams(result.teams || []);
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
    if (typeof window !== "undefined" && window.$ && teams.length > 0) {
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
  }, [teams]);


  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">
        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0">{'> Teams'}</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            <Link className="btn btn-common" href={`/admin/teams/new`} >New</Link>

            <a href="#">
              <Image src="/images/icon-setting.svg" width={33} height={33} alt="Settings" />
            </a>
          </div>
        </div>
        <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
            <h1 className="page-title">Teams</h1>

          </div>
        </div>

        <div className="body-main-cont">

          <form>
            <div className="table-responsive common-datatable">
              <table id="example" className="table">
                <thead>
                  <tr>
                    <th scope="col">Team</th>
                    <th scope="col">Manager</th>
                    <th scope="col">Telephone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Ground</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length > 0 ? (
                    teams.map((l, index) => (
                      <tr key={l._id}>
                        <td className="text-nowrap user-active">
                          <Link
                            href={`/admin/teams/${l._id}/view`}
                          >
                            {l.name}
                          </Link>
                        </td>
                        <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                        <td className="text-nowrap"><a href="tel:+44 08564 346268">{l.phone}</a></td>
                        <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">{l.email}</a></td>
                        <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">{l.email}</a></td>
                        <td className="text-nowrap">
                          <Link className="text-green"
                            href={`/admin/teams/${l._id}/edit`}
                          >
                            Edit
                          </Link>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Loading...</td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </form>
        </div>

      </main>
    </>
  );
}
