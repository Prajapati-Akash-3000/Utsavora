import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      className="text-sm text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition"
    >
      Logout
    </button>
  );
}
