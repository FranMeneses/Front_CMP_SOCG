import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que no requieren autenticación
const publicRoutes = ['/', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1] || 
                '';
                
  // Verificar si es una ruta pública
  if (publicRoutes.some(route => pathname === route)) {
    // Si el usuario ya está autenticado y trata de acceder a una ruta pública, permitir el acceso normal
    // La lógica de redirección se manejará del lado del cliente
    return NextResponse.next();
  }
  
  // Para rutas API, verificar el token en los headers
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    return NextResponse.next();
  }
  
  // Para rutas privadas, verificar el token
  // Nota: Aquí no verificamos la validez del token (expiración, etc.)
  // porque esa lógica ya la manejas en el cliente
  if (!token && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    '/features/:path*',
  ],
};