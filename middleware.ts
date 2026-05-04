export { auth as middleware } from '@/lib/utils/auth';

export const config = {
  matcher: ['/lobby/:path*', '/places/:path*'],
};
