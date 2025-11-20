import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Header component for the application
 * Contains navigation and branding
 */
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">App</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href={ROUTES.DASHBOARD}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href={ROUTES.PROFILE}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Profile
            </Link>
            <Link
              href={ROUTES.SETTINGS}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
