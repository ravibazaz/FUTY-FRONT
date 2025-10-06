"use client";
import Link from 'next/link'
export default function Header() {
  return (
    <>
      <header className="navbar sticky-top flex-md-nowrap p-0">
    <Link className="navbar-brand for-mobile col-md-3 col-lg-2 me-0" href="/admin/dashboard">
      <img className="logo" src="/images/logo.png" alt="FUTY" />
    </Link>
    <ul className="navbar-nav flex-row d-md-none">
      {/* <!-- <li className="nav-item text-nowrap">
        <button className="nav-link px-3 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch"
          aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </li> --> */}
      <li className="nav-item text-nowrap">
        <button className="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <i className="fa-solid fa-bars fs-4"></i>
        </button>
      </li>
    </ul>
    {/* <!-- <div id="navbarSearch" className="navbar-search w-100 collapse">
      <input className="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search" />
    </div> --> */}
  </header>
    </>

  );
}
