// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

export function middleware(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const parsed = parse(cookie);
  const token = parsed.token;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/employee'], // rute yang ingin diproteksi
};
