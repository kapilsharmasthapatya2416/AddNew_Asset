import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfilePopup } from '@/components/layout/home/UserProfilePopup';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'buttons.close': 'Close',
      'userMenu.mockName': 'John Doe',
      'userMenu.mockEmail': 'john.doe@test.com',
      'userMenu.userId': 'User ID',
      'userMenu.mockUserId': 'USR-2025-1047',
      'userMenu.role': 'Role',
      'userMenu.mockRole': 'Tax Officer',
      'userMenu.department': 'Department',
      'userMenu.mockDepartment': 'Property Tax',
      'userMenu.publicIp': 'Public IP',
      'userMenu.mockIp': '192.168.1.1',
      'userMenu.sessionId': 'Session ID',
      'userMenu.mockSessionId': 'SES-123456',
      'userMenu.loginTime': 'Login Time',
      'userMenu.mockLoginTime': '09/01/2026, 12:30:12',
      'app.securityPurpose': 'For security purposes',
    };
    return translations[key] || key;
  },
}));

describe('UserProfilePopup Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    username: 'Test User',
    ulbName: 'Test Municipality',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <UserProfilePopup {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders popup when isOpen is true', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('displays provided username', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('displays default username when not provided', () => {
    render(<UserProfilePopup {...defaultProps} username={undefined} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays email address', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('john.doe@test.com')).toBeInTheDocument();
  });

  it('displays user ID', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByText('USR-2025-1047')).toBeInTheDocument();
  });

  it('displays role', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Tax Officer')).toBeInTheDocument();
  });

  it('displays department with ulbName', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Test Municipality')).toBeInTheDocument();
  });

  it('displays default department when ulbName not provided', () => {
    render(<UserProfilePopup {...defaultProps} ulbName={undefined} />);
    expect(screen.getByText('Property Tax')).toBeInTheDocument();
  });

  it('displays public IP', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Public IP')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
  });

  it('displays session ID', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Session ID')).toBeInTheDocument();
    expect(screen.getByText('SES-123456')).toBeInTheDocument();
  });

  it('displays login time', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('Login Time')).toBeInTheDocument();
    expect(screen.getByText('09/01/2026, 12:30:12')).toBeInTheDocument();
  });

  it('displays security footer message', () => {
    render(<UserProfilePopup {...defaultProps} />);
    expect(screen.getByText('For security purposes')).toBeInTheDocument();
  });

  it('renders close button with correct accessibility', () => {
    render(<UserProfilePopup {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-label', 'Close');
    expect(closeButton).toHaveAttribute('title', 'Close');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<UserProfilePopup {...defaultProps} onClose={onClose} />);
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<UserProfilePopup {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    const onClose = vi.fn();
    render(<UserProfilePopup {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies correct positioning classes', () => {
    const { container } = render(<UserProfilePopup {...defaultProps} />);
    const popup = container.firstChild as HTMLElement;
    expect(popup).toHaveClass('absolute', 'top-12', 'right-0', 'z-50');
  });

  it('applies animation classes', () => {
    const { container } = render(<UserProfilePopup {...defaultProps} />);
    const popup = container.firstChild as HTMLElement;
    expect(popup).toHaveClass('animate-in', 'fade-in', 'zoom-in-95');
  });
});
