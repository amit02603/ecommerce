"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "@/services/authService";

// Define what the auth context gives to components that use it
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

// Create the context with an undefined default (we'll always use the Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider wraps the entire app so all components can access auth state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True while we check for an existing session

  // On first load, check if the user already has a valid session
  useEffect(function () {
    async function checkSession() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        // If the token is expired or invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  async function login(email: string, password: string) {
    const data = await loginUser({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data = await registerUser({ name, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function logout() {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    updateUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook — components call useAuth() instead of useContext(AuthContext) directly
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
