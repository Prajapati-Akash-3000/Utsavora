import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../common/LogoutButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Utsavora
        </Link>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
               <div className="flex items-center gap-4 mr-4">
                  {user.role === 'USER' && (
                     <>
                        <Link to="/user/my-events" className="text-sm font-medium text-gray-600 hover:text-indigo-600">My Events</Link>
                        <Link to="/user/bookings" className="text-sm font-medium text-gray-600 hover:text-indigo-600">My Bookings</Link>
                     </>
                  )}
               </div>
               <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Hello, {user.username || user.name}</span>
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
                <Link to="/login/user" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                    Login as User
                </Link>
                <Link to="/login/manager" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                    Login as Manager
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Register
                </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
