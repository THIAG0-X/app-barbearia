import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Barber } from '@/types';

interface AuthContextType {
  user: (User | Barber) | null;
  login: (user: User | Barber) => void;
  logout: () => void;
  isBarber: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isBarber: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User | Barber) | null>(null);

  const login = useCallback((u: User | Barber) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isBarber: user?.role === 'barber' }}>
      {children}
    </AuthContext.Provider>
  );
};
