import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <AppRoutes />
            </div>
        </BrowserRouter>
    </AuthProvider>
  );
}
