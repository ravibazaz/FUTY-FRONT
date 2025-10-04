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
  const router = useRouter();
  const [leagues, setLeagues] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Pages, setPages] = useState(1);
  const [Limit, setLimit] = useState(1);

  const fetchData = async (search = "", status = "", pageNo = 1) => {
    const res = await fetch(
      `/api/leagues?q=${search}&filter=${status}&page=${pageNo}`
    );
    const data = await res.json();

    setLeagues(data.leagues);
    setTotalPages(data.total);
    setPages(data.pages);
    setLimit(data.limit);
  };

  useEffect(() => {
    //fetchData(q, filter, page);
    fetchData();
    const toastMessage = document.cookie
    .split("; ")
    .find((row) => row.startsWith("toastMessage="));

    if (toastMessage) {
      Toast.fire({
        icon: "success",
        title: decodeURIComponent(toastMessage.split("=")[1]) ,
      });
      document.cookie = "toastMessage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 when new search
    fetchData(q, filter, 1);
  };

  const handleReset = async () => {
    setQ("");
    setFilter("");
    fetchData();
  };





  return (
    <>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">League List</h3>
          <div className="card-tools">
            <form
              onSubmit={handleSearch}
              id="create-course-form"
              className="form-inline mb-3"
            >
              <div
                className="input-group input-group-sm mr-2"
                style={{ width: "200px" }}
              >
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
              </div>

              <div
                className="input-group input-group-sm mr-2"
                style={{ width: "150px" }}
              >
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="form-control"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-secondary btn-sm mr-2">
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary btn-sm mr-2"
              >
                Reset Search
              </button>

              <Link
                href="/admin/leagues/new"
                className="btn btn-primary btn-sm ml-auto"
              >
                + New League
              </Link>
            </form>
          </div>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ width: "10px" }}>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leagues.map((l, index) => (
                <tr key={l._id}>
                  <td>{(page - 1) * Limit + index + 1}</td>
                  <td>{l.title}</td>
                  <td>{l.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        href={`/admin/leagues/${l._id}/edit`}
                        className="btn btn-success btn-sm mr-2"
                      >
                        Edit
                      </Link>
                      <DeleteLeagueButton
                        onDelete={deleteLeague.bind(null, l._id.toString())}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ⬅ Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === Pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
