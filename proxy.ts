import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from './lib/auth';

// Explicitly define which routes should be protected.
// For now, let's protect /dashboard and all its subroutes
const protectedRoutes = ['/dashboard', '/students', '/finance', '/attendance', '/results', '/communication'];

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('edu_token')?.value;

  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      await verifyAuth(token);
      return NextResponse.next();
    } catch (err) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('edu_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
