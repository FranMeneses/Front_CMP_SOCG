'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useHooks } from '@/app/features/hooks/useHooks';
import { jwtDecode } from 'jwt-decode';
import { IJwtPayload } from '@/app/models/IAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userEmail: string | null;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  userEmail: null,
  checkAuth: () => false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const { userRole } = useHooks();

  const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setUserId(null);
        setUserEmail(null);
        return false;
      }

      const decoded = jwtDecode(token) as IJwtPayload;
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token ha expirado
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token expirado, limpiando autenticación');
        clearAuthData();
        return false;
      }
      
      // Verificar que el token tenga la estructura correcta
      if (!decoded.sub || !decoded.email) {
        console.log('Token inválido, falta información requerida');
        clearAuthData();
        return false;
      }
      
      setIsAuthenticated(true);
      setUserId(decoded.sub);
      setUserEmail(decoded.email);
      return true;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      clearAuthData();
      return false;
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
  };

  useEffect(() => {
    setIsLoading(true);
    const isValid = checkAuth();
    setIsAuthenticated(isValid);
    setIsLoading(false);
  }, [userRole]);

  // Verificar autenticación periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      userId,
      userEmail,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}