import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/features/registry', '/features/forgotPassword'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1] || 
                '';
                
  if (publicRoutes.some(route => pathname === route)) {
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
  
  if (!token && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/features/:path*',
    '/:path*',
  ],
};