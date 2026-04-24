import { useAuth } from "../hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
  const { accesstoken, user } = useAuth();
  return <>{accesstoken && user ? <Outlet /> : <Navigate to="/signin" />}</>;
}
