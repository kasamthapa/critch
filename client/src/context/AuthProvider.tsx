import { useState, type ReactNode } from "react";
import type { AuthData } from "../types/auth.types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  function login({ user, accesstoken }: AuthData) {
    setAuth({ user, accesstoken });
  }
  function logout() {
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
export { AuthContext };
