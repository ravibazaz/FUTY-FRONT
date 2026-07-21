"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { deleteAdvert } from "@/actions/advertsActions";

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

export default function StoreTable() {
  const tableRef = useRef(null);
  const dtInstance = useRef(null);

  // Toast shown after redirect back from create/edit pages
  useEffect(() => {
    const toastMessage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("toastMessage="));

    if (toastMessage) {
      Toast.fire({
        icon: "success",
        title: decodeURIComponent(toastMessage.split("=")[1]),
      });
      document.cookie =
        "toastMessage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.$) return;
    const $ = window.$;

    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    const table = $(tableRef.current).DataTable({
      serverSide: true,
      processing: true,
      searching: true,
      searchDelay: 500, // debounce: waits 500ms after typing stops before querying DB
      ajax: {
        url: "/api/adverts",
        type: "GET",
      },
      language: { searchPlaceholder: "Search" },
      columns: [
        {
          data: "name",
          render: function (data, type, row) {
            return `<a href="/admin/adverts/${row._id}/view">${data}</a>`;
          },
        },
        { data: "date" },
        { data: "time" },
        { data: "end_date" },
        { data: "end_time" },
        {
          data: null,
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return `
              <a class="text-green" href="/admin/adverts/${row._id}/edit">Edit</a>
              <button type="button" class="btn-delete-advert" data-id="${row._id}">Delete</button>
            `;
          },
        },
      ],
      initComplete: function () {
        $(".common-datatable .dt-container .row").eq(0).addClass("row-first");
        $(".common-datatable .dt-container .row").eq(1).addClass("row-second");
        $(".common-datatable .dt-container .row").eq(2).addClass("row-third");

        $(".dt-layout-start").addClass("dt-entries-per-page").removeClass("me-auto");
        $(".dt-layout-end").addClass("dt-search-bar").removeClass("ms-auto");

        $(".dt-search-bar input.form-control")
          .addClass("dt-search-fld")
          .after('<input class="btn-search-reset" type="reset" value="Reset">');

        $(document).on("click", ".btn-search-reset", function () {
          table.search("").draw();
        });
      },
    });

    dtInstance.current = table;

    // Delete: SweetAlert confirm on this page -> on "Yes" -> deleteAdvert() -> reload table
    $(tableRef.current).on("click", ".btn-delete-advert", async function () {
      const id = $(this).data("id");

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This advert will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        try {
          await deleteAdvert(id);
          table.ajax.reload(null, false); // refresh table, keep current page/search state
          Toast.fire({ icon: "success", title: "Advert deleted successfully" });
        } catch (err) {
          console.error("Delete failed:", err);
          Swal.fire("Error", "Failed to delete the advert.", "error");
        }
      }
    });

    return () => {
      $(document).off("click", ".btn-search-reset");
      $(tableRef.current).off("click", ".btn-delete-advert");
      if (dtInstance.current) {
        dtInstance.current.destroy();
        dtInstance.current = null;
      }
    };
  }, []);

  return (
    <main className="main-body col-md-9 col-lg-9 col-xl-10">
      <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
        <div className="top-left">
          <p className="top-breadcrumb mb-0">{"> Adverts"}</p>
        </div>
        <div className="top-right d-flex justify-content-between align-items-center gap-10">
          <Link prefetch={false} className="btn btn-common" href="/admin/adverts/new">
            New Advert
          </Link>
          <a href="#">
            <Image src="/images/icon-setting.svg" width={33} height={33} alt="Settings" />
          </a>
        </div>
      </div>

      <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
        <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
          <h1 className="page-title">Adverts</h1>
        </div>
      </div>

      <div className="body-main-cont">
        <div className="table-responsive common-datatable">
          <table id="example" ref={tableRef} className="table">
            <thead>
              <tr>
                <th scope="col">Advert Title</th>
                <th scope="col">Start Date</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Date</th>
                <th scope="col">End Time</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>{/* rendered entirely by DataTables */}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}