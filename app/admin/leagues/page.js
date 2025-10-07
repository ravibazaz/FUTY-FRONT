"use client";

import { useState, useEffect } from "react";
import DeleteLeagueButton from "@/components/DeleteLeagueButton"; // adjust path
import { deleteLeague } from "@/actions/leaguesActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function LeagueTable() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.$) {
      //console.log('test');
      const $ = window.$;
      const tableElement = $("#example");
      if ($.fn.DataTable.isDataTable('#example')) {
        $('#example').DataTable().destroy();
    }
      if (tableElement.length) {
        tableElement.DataTable({
      search: {
        // Enter Key to Search
        // return: true
      },
      language: {
        searchPlaceholder: "Search",
      }, 
          initComplete: function () {
            // Add class to first row
            $(".common-datatable .dt-container .row").eq(0).addClass("row-first");

            // Add class to second row
            $(".common-datatable .dt-container .row").eq(1).addClass("row-second");

            // Add class to third row
            $(".common-datatable .dt-container .row").eq(2).addClass("row-third");

            // Add & Remove class under first row div
            $(".dt-layout-start")
              .addClass("dt-entries-per-page")
              .removeClass("me-auto");

            $(".dt-layout-end")
              .addClass("dt-search-bar")
              .removeClass("ms-auto");

            // Add class to search input and append reset button
            const $searchInput = $(".dt-search-bar input.form-control")
              .addClass("dt-search-fld")
              .after('<input class="btn-search-reset" type="reset" value="Reset">');

            // Bind click event to reset button
            $(document).on("click", ".btn-search-reset", function () {
              const table = $("#example").DataTable();
              table.search("").draw(); // Clear search and redraw
            });
          },
        });
      }
    }
  }, []);


  return (
    <>
      <main className="main-body col-md-9 col-lg-9 col-xl-10">

        <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="top-left">
            <p className="top-breadcrumb mb-0"> Leagues</p>
          </div>
          <div className="top-right d-flex justify-content-between align-items-center gap-10">
            <a className="btn btn-common" href="login.php">New</a>
            <a href="#">
              <img src="/images/icon-setting.svg" alt="Settings" />
            </a>
          </div>
        </div>

        <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
          <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
            <h1 className="page-title">Leagues</h1>
            {/* <!-- <ul className="page-tab-links d-flex flex-wrap align-items-center gap-10-30 fs-12 list-unstyled mb-0">
              <li><a className="underline-hover" href="#">All</a></li>
              <li><a className="underline-hover" href="#">Active</a></li>
              <li><a className="underline-hover" href="#">Club</a></li>
              <li><a className="underline-hover" href="#">League</a></li>
            </ul> --> */}
          </div>
        </div>

        <div className="body-main-cont">
          {/* <!-- <div className="table-search-bar d-flex gap-10-30 mb-30">
            <form className="d-flex gap-10-30">
                <input className="form-control bg-one w-300" type="text" placeholder="Search" aria-label="Search" />
                <input className="btn btn-link text-body text-decoration-none text-hover-primary fs-10" type="reset" value="Reset">
            </form>
          </div>
          <p className="mb-10">Search results</p> --> */}
          <form>
            <div className="table-responsive common-datatable">
              <table id="example" className="table">
                <thead>
                  <tr>
                    <th scope="col">Team</th>
                    <th scope="col">Secretary</th>
                    <th scope="col">Telephone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Peter Housman League</a></td>
                    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                    <td className="text-nowrap"><a href="#">+44 08564 346268</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Freetown League</a></td>
                    <td className="text-nowrap"><a href="#">Paul Tader</a></td>
                    <td className="text-nowrap"><a href="#">+44 08932 251628</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Newcastle six League</a></td>
                    <td className="text-nowrap"><a href="#">Steve Green</a></td>
                    <td className="text-nowrap"><a href="#">+44 01246 289571</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Andover league</a></td>
                    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                    <td className="text-nowrap"><a href="#">+44 08564 346268</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Peter Housman League</a></td>
                    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                    <td className="text-nowrap"><a href="#">+44 08564 346268</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Freetown League</a></td>
                    <td className="text-nowrap"><a href="#">Paul Tader</a></td>
                    <td className="text-nowrap"><a href="#">+44 08932 251628</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Newcastle six League</a></td>
                    <td className="text-nowrap"><a href="#">Steve Green</a></td>
                    <td className="text-nowrap"><a href="#">+44 01246 289571</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Andover league</a></td>
                    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                    <td className="text-nowrap"><a href="#">+44 08564 346268</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Peter Housman League</a></td>
                    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                    <td className="text-nowrap"><a href="#">+44 08564 346268</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Freetown League</a></td>
                    <td className="text-nowrap"><a href="#">Paul Tader</a></td>
                    <td className="text-nowrap"><a href="#">+44 08932 251628</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Newcastle six League</a></td>
                    <td className="text-nowrap"><a href="#">Steve Green</a></td>
                    <td className="text-nowrap"><a href="#">+44 01246 289571</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                  <tr>
                    <td className="text-nowrap user-active"><a href="#">Andover league</a></td>
                    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                    <td className="text-nowrap"><a href="#">+44 08564 346268</a></td>
                    <td className="text-nowrap"><a href="#">u7@phyl.co.uk</a></td>
                    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>

      </main>
    </>
  );
}
