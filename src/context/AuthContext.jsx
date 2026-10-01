import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tự động khôi phục user từ localStorage khi ứng dụng load lần đầu
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      // 1. Handle Google OAuth Credential Response
      if (credentials && credentials.credential) {
        const base64Url = credentials.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const decodedToken = JSON.parse(jsonPayload);
        const userData = {
          id: decodedToken.sub || 'google-user',
          email: decodedToken.email || 'user@gmail.com',
          name: decodedToken.name || 'Google User',
          picture: decodedToken.picture || '',
          token: credentials.credential,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', credentials.credential);
        return userData;
      }

      // 2. Handle Local Email/Password Login (No backend required)
      if (credentials && credentials.email) {
        const namePart = credentials.email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const userData = {
          id: `local-${Date.now()}`,
          email: credentials.email,
          name: credentials.name || formattedName,
          picture: '',
          token: `mock-jwt-token-${Date.now()}`,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        return userData;
      }

      throw new Error('Invalid login credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const userData = {
        id: `local-${Date.now()}`,
        email: formData.email,
        name: formData.name || 'New User',
        picture: '',
        token: `mock-jwt-token-${Date.now()}`,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const checkAuth = useCallback(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser((prev) => {
          if (prev?.email === parsed?.email && prev?.id === parsed?.id) {
            return prev;
          }
          return parsed;
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, checkAuth }),
    [user, loading, login, register, logout, checkAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}