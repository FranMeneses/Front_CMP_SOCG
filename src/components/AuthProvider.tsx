'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useHooks } from '@/app/features/hooks/useHooks';
import { jwtDecode } from 'jwt-decode';
import { IJwtPayload } from '@/app/models/IAuth';
import { addAuthEventListener, removeAuthEventListener } from '@/lib/authEvents';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userEmail: string | null;
  checkAuth: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  userEmail: null,
  checkAuth: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const { userRole } = useHooks();

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
  };

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

  const logout = () => {
    clearAuthData();
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

  // Escuchar cambios en el localStorage para sincronizar con useHooks
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'rol') {
        if (event.newValue === null) {
          // Si se eliminó el token o rol, limpiar autenticación
          clearAuthData();
        } else {
          // Si se agregó/modificó, verificar autenticación
          checkAuth();
        }
      }
    };

    // Función para manejar el evento personalizado de logout
    const handleCustomLogout = () => {
      clearAuthData();
    };

    // Función para manejar el evento personalizado de login
    const handleCustomLogin = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    addAuthEventListener('LOGOUT', handleCustomLogout);
    addAuthEventListener('LOGIN', handleCustomLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      removeAuthEventListener('LOGOUT', handleCustomLogout);
      removeAuthEventListener('LOGIN', handleCustomLogin);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      userId,
      userEmail,
      checkAuth,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}