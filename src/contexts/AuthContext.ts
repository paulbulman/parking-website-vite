import { createContext } from "react";
import type { SignInOutput } from "aws-amplify/auth";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<SignInOutput>;
  logout: () => void;
  getToken: () => Promise<string | undefined>;
  refreshAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
