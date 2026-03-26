import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="bg-transparent min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-0">
        {/* We can eventually add a sidebar here if needed. 
            For now, we are utilizing the same Navbar, 
            but encapsulating Outlet restricts it to dashboard routes. */}
        <Outlet />
      </main>
    </div>
  );
}
