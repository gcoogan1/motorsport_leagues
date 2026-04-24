import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/providers/auth/useAuth";


// TODO: Add loading state while auth is being determined (if using async auth check)

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
