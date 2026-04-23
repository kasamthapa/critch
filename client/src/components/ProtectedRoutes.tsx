import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {
  const context = useContext(AuthContext);
  return (
    <>
      {context?.accesstoken && context.user ? (
        <Outlet />
      ) : (
        <Navigate to="/signin" />
      )}
    </>
  );
}
