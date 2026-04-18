import { useState, type ReactNode } from "react";
import type { AuthData } from "../types/auth.types";
import { AuthContext } from "./AuthContext";

function getInitialAuth(): AuthData | null {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return { accesstoken: token, user: JSON.parse(user) };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(getInitialAuth);
  function login({ user, accesstoken }: AuthData) {
    localStorage.setItem("token", accesstoken);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ user, accesstoken });
  }
  function logout() {
    localStorage.removeItem("token");
    setAuth(null);
  }
  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        accesstoken: auth?.accesstoken ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
