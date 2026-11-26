import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard';
import LoginForm from '@/components/login-form';
import { isValidSessionToken, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  let authenticated = false;
  try { authenticated = isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value); } catch { authenticated = false; }
  if (!authenticated && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.AUTH_SESSION_SECRET) return <LoginForm />;
  if (!authenticated) redirect('/login-unavailable');
  return <Dashboard />;
}
