import { useState, type ReactNode } from "react";
import type { AuthData } from "../types/auth.types";
import { AuthContext } from "./AuthContext";
import type { UserSummary } from "../types/user.types";

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
  function updateUser(updates: Partial<UserSummary>) {
    setAuth((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev.user, ...updates };
      localStorage.setItem("user", JSON.stringify(updateUser));
      return { ...prev, user: updatedUser };
    });
  }
  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        accesstoken: auth?.accesstoken ?? null,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
