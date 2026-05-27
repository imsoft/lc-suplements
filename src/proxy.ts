import { NextRequest, NextResponse } from "next/server";

const PROTECTED_STORE = ["/orders", "/wishlist", "/account"];
const PROTECTED_ADMIN = ["/admin"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

// Better Auth usa el prefijo __Secure- en producción HTTPS
function hasSessionCookie(request: NextRequest) {
  return (
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token")
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = hasSessionCookie(request);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedStore = PROTECTED_STORE.some((r) => pathname.startsWith(r));
  const isAdminRoute = PROTECTED_ADMIN.some((r) => pathname.startsWith(r));

  // Si ya tiene sesión no necesita ir a login/register
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rutas protegidas de la tienda → login
  if (isProtectedStore && !hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas de admin → login si no hay sesión
  if (isAdminRoute && !hasSession) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
