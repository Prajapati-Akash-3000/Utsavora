import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/layout/ScrollToTop";
import GlobalBackground from "./components/layout/GlobalBackground";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
          <BrowserRouter>
              <ScrollToTop />
              <GlobalBackground />
              <AppRoutes />
          </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
