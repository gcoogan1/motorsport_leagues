import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Custom hook to access authentication context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
