import { createContext, useState, useEffect, useContext } from "react";

import type { ReactNode } from "react";

interface AuthContextType {
  currUser: string | null;
  setCurrUser: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currUser, setCurrUser] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setCurrUser(userId);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currUser,
        setCurrUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
