import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/home/Footer';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, options?: { default?: string }) => {
    const translations: Record<string, string> = {
      'app.defaultUlbName': 'Default Municipality',
      'footer.allRightsReserved': 'All rights reserved.',
    };
    return translations[key] || options?.default || key;
  },
}));

describe('Footer Component', () => {
  it('renders with provided ulbName', () => {
    render(<Footer ulbName="Test Municipality" />);
    expect(screen.getByText(/Test Municipality/)).toBeInTheDocument();
  });

  it('renders with default ulbName when not provided', () => {
    render(<Footer />);
    expect(screen.getByText(/Default Municipality/)).toBeInTheDocument();
  });

  it('displays copyright symbol and current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer ulbName="Test" />);
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('displays all rights reserved text', () => {
    render(<Footer ulbName="Test" />);
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('renders as a footer element', () => {
    render(<Footer ulbName="Test" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<Footer ulbName="Test" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-[#004c8c]', 'text-white', 'text-center');
  });

  it('has responsive text size classes', () => {
    render(<Footer ulbName="Test" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('text-xs', 'sm:text-sm');
  });

  it('has mt-auto for sticky footer positioning', () => {
    render(<Footer ulbName="Test" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('mt-auto');
  });
});
