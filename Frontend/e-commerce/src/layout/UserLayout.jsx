import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="w-full max-w-[100vw] min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}