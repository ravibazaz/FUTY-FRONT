import Header from "@/components/Header";
import Sidebar from '@/components/Sidebar';
export default function AdminLayout({ children }) {
  return (
    <>
      <Header></Header>
      <div className="container-fluid">
        <div className="row">
          <Sidebar></Sidebar>
          {children}
        </div>
      </div>
    </>
  );
}
