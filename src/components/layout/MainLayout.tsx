import { Header } from './Header';
import { Footer } from './Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component that wraps all pages
 * Provides consistent header and footer across the application
 */
export function MainLayout({ children }: MainLayoutProps) {
  // Fallback ULB data; replace with real data source (API/database) when available
  const ulbData = {
    id: 1,
    ulbCode: 'TMC',
    ulbName: 'Thane Municipal Corporation',
    ulbTypeId: 1,
    isActive: true,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Header ulbData={ulbData} />
      <main className="flex-1 transition-all duration-300 pt-20 flex flex-col">
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
