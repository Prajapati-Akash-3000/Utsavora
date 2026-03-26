import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        logout();
        navigate("/");
      }}
      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-red-500 hover:text-red-600 bg-transparent hover:bg-red-50 border border-red-200/60 hover:border-red-300 text-sm font-bold transition-all duration-200 ${className}`}
    >
      <LogOut size={15} />
      <span>Logout</span>
    </button>
  );
}
