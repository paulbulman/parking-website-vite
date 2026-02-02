import { useState, useEffect, type ReactNode } from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await signIn({ username, password });

      // Only set authenticated if fully signed in (not e.g. change password required)
      if (response.isSignedIn) {
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getToken = async (): Promise<string | undefined> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch (error) {
      console.error("Error fetching auth token:", error);
      return undefined;
    }
  };

  // Don't render children until we've checked auth status
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, getToken, refreshAuthStatus: checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}

