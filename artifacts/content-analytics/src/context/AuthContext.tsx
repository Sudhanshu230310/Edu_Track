import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { saveAuth, clearAuth, getSavedUser, getToken, type AuthUser } from "@/lib/auth";
import { setAuthTokenGetter } from "@workspace/api-client-react";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = getSavedUser();
    const token = getToken();
    if (savedUser && token) {
      setUser(savedUser);
      setAuthTokenGetter(() => getToken());
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: AuthUser) => {
    saveAuth(token, userData);
    setUser(userData);
    setAuthTokenGetter(() => getToken());
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setAuthTokenGetter(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
