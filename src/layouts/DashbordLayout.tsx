import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout=()=> {
  return (
    <div className="flex bg-background">
      <Sidebar />

      {/* Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export default DashboardLayout