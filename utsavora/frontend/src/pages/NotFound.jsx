import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-purple-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/">
        <Button variant="primary" size="lg">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
