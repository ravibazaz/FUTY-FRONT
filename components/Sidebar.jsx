"use client";
import Link from 'next/link'
import { usePathname } from "next/navigation";
import LogoutButton from '@/components/LogoutButton';
export default function Sidebar() {
    const pathname = usePathname();
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
                    <Link  className={`nav-link ${pathname.startsWith('/admin/leagues') ? 'active' : ''}`}  aria-current="page" href="/admin/leagues"><span className="link-text">Leagues</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/clubs') ? 'active' : ''}`} href="/admin/clubs"><span className="link-text">Clubs</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/teams') ? 'active' : ''}`} href="/admin/teams"><span className="link-text">Teams</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/managers') ? 'active' : ''}`} href="/admin/managers"><span className="link-text">Managers</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/fans') ? 'active' : ''}`} href="/admin/fans"><span className="link-text">Fans</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/grounds') ? 'active' : ''}`} href="/admin/grounds"><span className="link-text">Grounds</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/friendlies') ? 'active' : ''}`} href="/admin/friendlies"><span className="link-text">Friendlies</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/tournaments') ? 'active' : ''}`} href="/admin/tournaments"><span className="link-text">Tournaments</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/adverts') ? 'active' : ''}`} href="/admin/adverts"><span className="link-text">Adverts</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${pathname.startsWith('/admin/stores') ? 'active' : ''}`} href="/admin/stores"><span className="link-text">Store</span></Link>
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
