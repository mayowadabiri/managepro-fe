import { User } from '@/types';
import React, { useState, createContext, useContext } from 'react';

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return <AuthContext.Provider value={{
    user,
    setUser,
  }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};