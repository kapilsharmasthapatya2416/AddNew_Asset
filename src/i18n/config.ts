// Define a minimal interface for the router to avoid deep Next.js imports in config
interface MinimalRouter {
  push: (href: string) => void;
}

/**
 * i18n Configuration
 * Defines supported locales and default locale for the application
 */

export const locales = ['en', 'hi', 'mr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

/**
 * Switches the application locale by updating cookies, localStorage, and redirecting.
 */
export const switchLocale = (locale: Locale, pathname: string, router: MinimalRouter): void => {
  // Save to cookie (expires in 1 year)
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; expires=${expires.toUTCString()}`;
  }

  // Save to localStorage as backup
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('NEXT_LOCALE', locale);
    } catch {
      // Ignore write errors (e.g., Safari private mode, quota exceeded)
    }
  }

  // Extract the current path without locale prefix
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  const pathWithoutLocale = pathname.replace(localePattern, '') || '/';

  // Construct new path
  const newPath = `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  // Use simple push; Next.js middleware and layouts will handle the rest
  router.push(newPath);
};
