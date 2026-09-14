import { createContext, useState, useEffect, type ReactNode } from 'react';
import { meRequest, loginRequest, registerRequest, logoutRequest } from '../services/api/auth';
import type { User, LoginData, RegisterData } from '../services/api/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    meRequest()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(data: LoginData) {
    const user = await loginRequest(data);
    setUser(user);
  }

  async function register(data: RegisterData) {
    const user = await registerRequest(data);
    setUser(user);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  function updateUser(updated: User) {
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
