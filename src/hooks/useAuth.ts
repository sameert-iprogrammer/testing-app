import React from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
}

interface UseAuthReturn {
  auth: AuthState;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const MOCK_EMAIL = 'test@example.com';
const MOCK_PASSWORD = 'Admin@123';

export default function useAuth(): UseAuthReturn {
  const [auth, setAuth] = React.useState<AuthState>(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userJson = localStorage.getItem('user');
    let user: { email: string; name: string } | null = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson) as { email: string; name: string };
      } catch {
        user = null;
      }
    }
    return { isAuthenticated, user };
  });

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ email: MOCK_EMAIL, name: 'Test User' }));
      setAuth({ isAuthenticated: true, user: { email: MOCK_EMAIL, name: 'Test User' } });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = (): void => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null });
  };

  return { auth, login, logout };
}
