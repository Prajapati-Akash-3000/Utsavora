import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-blue-600">
          Utsavora
        </h1>
        <p className="text-xl text-gray-600">
          Simplify Your Event Management. Book Managers, Register Guests, and Manage Payments effortlessly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Public Visitor Card */}
          <Link to="/event/1" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 h-full">
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">For Visitors</h3>
              <p className="text-gray-500 mt-2">Find events, register, and get your digital tickets instantly.</p>
              <div className="mt-4 text-blue-500 font-medium">Browse Events &rarr;</div>
            </div>
          </Link>

          {/* User/Host Card */}
           <Link to="/user/event/1" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 h-full">
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">For Hosts</h3>
              <p className="text-gray-500 mt-2">Manage your bookings, hire managers, and track payments.</p>
              <div className="mt-4 text-blue-500 font-medium">Manage My Event &rarr;</div>
            </div>
          </Link>
        </div>

        <div className="mt-12 flex justify-center gap-4 text-sm text-gray-400">
             <Link to="/admin" className="hover:text-gray-600">Admin Dashboard</Link>
             <span>&bull;</span>
             <Link to="/manager/requests" className="hover:text-gray-600">Manager Portal</Link>
        </div>
      </div>
    </div>
  );
}
