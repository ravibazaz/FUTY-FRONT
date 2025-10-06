"use client";
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton';
export default function Sidebar() {
  return (
    <>
    <div className="sidebar col-md-3 col-lg-3 col-xl-2 p-0 bg-primary">
    <div className="offcanvas-md offcanvas-end" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
        <div className="offcanvas-header">
              <Link className="logo-offcanvas" href="/admin/dashboard">
                <img className="logo" src="/images/logo.png" alt="FUTY" />
            </Link>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-md-flex flex-column p-0 overflow-y-auto">
            <Link className="logo-sidebar for-desktop" href="/admin/dashboard">
                <img className="logo" src="/images/logo.png" alt="FUTY" />
            </Link>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="leagues.php"><span className="link-text">Leagues</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Clubs</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Teams</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Managers</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Fans</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Grounds</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Friendlies</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Tournaments</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Adverts</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><span className="link-text">Store</span></a>
                </li>
                
            </ul>
            <hr className="my-3" />
            <ul className="nav flex-column mb-auto">
                <LogoutButton></LogoutButton>
            </ul>
        </div>
    </div>
</div>

    </>

  );
}
