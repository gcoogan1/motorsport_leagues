import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/providers/auth/useAuth";


// TODO: Add loading state while auth is being determined (if using async auth check)

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to an unavailable page
    return <Navigate to="/unavailable" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
