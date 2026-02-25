import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  role?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: User & { password?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8005';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('gridai_token');
      const cachedUser = localStorage.getItem('gridai_user');

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Immediately restore from cache so name shows right away
      if (cachedUser) {
        try { setUser(JSON.parse(cachedUser)); } catch { /* ignore */ }
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('gridai_user', JSON.stringify(userData));
        } else {
          // Token invalid — clear everything
          if (token.startsWith('mock-token-')) {
            // keep mock user
          } else {
            localStorage.removeItem('gridai_token');
            localStorage.removeItem('gridai_user');
            setUser(null);
          }
        }
      } catch (error) {
        // Network error — keep the cached user so the app still works offline
        console.warn("Session check failed, using cached user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Backend auth failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('gridai_token', data.access_token);
      localStorage.setItem('gridai_user', JSON.stringify(data.user));
    } catch (error) {
      // PROTOTYPE FALLBACK: Mock login
      console.warn("Auth failed, using mock for prototype:", error);
      const mockUser = { name: email.split('@')[0], email, role: 'Operator' };
      setUser(mockUser);
      localStorage.setItem('gridai_token', 'mock-token-' + Date.now());
      localStorage.setItem('gridai_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: User & { password?: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name
        }),
      });

      if (!response.ok) {
        throw new Error('Backend auth failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('gridai_token', data.access_token);
      localStorage.setItem('gridai_user', JSON.stringify(data.user));
    } catch (error) {
      // PROTOTYPE FALLBACK: Mock signup
      console.warn("Signup failed, using mock for prototype:", error);
      const mockUser = {
        name: userData.name,
        email: userData.email,
        role: 'Operator',
        organization: 'Prototype Corp'
      };
      setUser(mockUser);
      localStorage.setItem('gridai_token', 'mock-token-' + Date.now());
      localStorage.setItem('gridai_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gridai_token');
    localStorage.removeItem('gridai_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
