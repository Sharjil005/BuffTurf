import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { meRequest, loginRequest, registerRequest, logoutRequest } from '../services/api/auth';
import type { User, LoginData, RegisterData } from '../services/api/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}