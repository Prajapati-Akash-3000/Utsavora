import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-wider">UTSAVORA ADMIN</h2>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/payments" 
            className={({ isActive }) => 
              `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            Payments
          </NavLink>
          <NavLink 
            to="/admin/events" 
            className={({ isActive }) => 
              `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            Events
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
