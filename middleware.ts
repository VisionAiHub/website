import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all routes except API, Next internals, Vercel internals, static files,
  // and the icon files Next.js generates from src/app/icon.png etc.
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|icon|apple-icon|opengraph-image|twitter-image|sitemap.xml|robots.txt).*)',
  ],
};
