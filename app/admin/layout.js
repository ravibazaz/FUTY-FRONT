import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link'

export default function AdminLayout({ children }) {
    return (
      <div className="wrapper">
        {/* Main Sidebar */}
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <a href="#" className="brand-link">
            <span className="brand-text font-weight-light">FUTY: Friendly App</span>
          </a>
          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
                <li className="nav-item">
                  <Link href="/admin/dashboard" className="nav-link">
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>Dashboard</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link  href="/admin/leagues" className="nav-link">
                    <i className="nav-icon fas fa-newspaper" />
                    <p>Manage Leagues</p>
                  </Link >
                </li>
                <li className="nav-item">
                  <LogoutButton></LogoutButton>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <div className="content-wrapper">
          <section className="content pt-4">
            <div className="container-fluid">{children}</div>
          </section>
        </div>
      </div>
    );
  }
  