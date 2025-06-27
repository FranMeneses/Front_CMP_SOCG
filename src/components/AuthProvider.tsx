'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useHooks } from '@/app/features/hooks/useHooks';
import { jwtDecode } from 'jwt-decode';

// Definir el tipo para el contexto de autenticación
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  checkAuth: () => false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Usamos tu hook existente que ya maneja login/logout
  const { userRole } = useHooks();

  // Función para verificar la autenticación
  const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      // Verificar validez del token
      const decoded = jwtDecode(token) as any;
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp < currentTime) {
        // Token expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rol');
        setIsAuthenticated(false);
        return false;
      }
      
      // Token válido
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      setIsAuthenticated(false);
      return false;
    }
  };

  // Verificar autenticación al cargar y cuando cambie el rol de usuario
  useEffect(() => {
    setIsLoading(true);
    const isValid = checkAuth();
    setIsAuthenticated(isValid);
    setIsLoading(false);
  }, [userRole]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}