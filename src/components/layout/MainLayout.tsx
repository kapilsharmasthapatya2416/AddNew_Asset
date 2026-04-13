import { cookies, headers } from 'next/headers';
import { getLayoutShellContextFromCookies } from '@/lib/utils/cookie';
import { Header } from './Header';
import { Footer } from './Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  /** Kept for callers (e.g. dashboard); layout shell is locale-agnostic. */
  locale?: string;
}

function clientIpFromHeaders(h: Headers): string | undefined {
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = h.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return undefined;
}

/**
 * Main layout: header, main content, footer (no sidebar).
 */
export async function MainLayout({ children, locale }: MainLayoutProps) {
  void locale;

  const headerList = await headers();
  const clientIp = clientIpFromHeaders(headerList);

  const cookieStore = await cookies();
  const { ulbData, userDisplayName } = getLayoutShellContextFromCookies(cookieStore);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Header ulbData={ulbData} userDisplayName={userDisplayName} clientIp={clientIp} />
      <main className="flex flex-1 flex-col pt-20">
        <div className="w-full flex-1 px-3 py-3 md:px-4">{children}</div>
      </main>
      <Footer ulbData={ulbData} />
    </div>
  );
}
