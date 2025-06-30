'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner'; 

export default function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: React.PropsWithChildren<P>) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/');
      }
    }, [isAuthenticated, isLoading, router]);

    // Mostrar indicador de carga mientras se verifica la autenticación
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Si está autenticado, mostrar el componente protegido
    return isAuthenticated ? <Component {...props} /> : null;
  };
}