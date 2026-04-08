import DrawerShell from '@/components/modules/property-tax/ptis/QuickDataEntry/QuickDataDrawer/DrawerShell';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { usePathname } from 'next/navigation';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/en/property-tax/ptis/QuickDataEntry/123/Society'),
    useSearchParams: vi.fn(() => new URLSearchParams({
        wardNo: 'W-10',
        propertyNo: 'P-101',
        partitionNo: '0',
        propertyId: '123'
    })),
    useRouter: () => ({
        push: mockPush
    }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
    useTranslations: (namespace: string) => (key: string) => {
        const translations: Record<string, Record<string, string>> = {
            'common': {
                'app.assessmentSystem': 'PTIS Assessment',
                'buttons.close': 'Close'
            },
            'quickDataEntry': {
                'roomSubmission.info.ward': 'Ward',
                'roomSubmission.info.property': 'Property',
                'roomSubmission.info.partition': 'Partition'
            }
        };
        return translations[namespace]?.[key] || key;
    },
}));

// Mock icons
vi.mock('lucide-react', () => ({
    Home: () => <div data-testid="icon-home" />,
    Users: () => <div data-testid="icon-users" />,
    Building2: () => <div data-testid="icon-building2" />,
    Layers: () => <div data-testid="icon-layers" />,
    Percent: () => <div data-testid="icon-percent" />,
    FileText: () => <div data-testid="icon-filetext" />,
    Building: () => <div data-testid="icon-building" />,
    X: () => <div data-testid="icon-x" />,
}));

describe('DrawerShell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the header title and breadcrumbs correctly', () => {
        render(
            <DrawerShell locale="en">
                <div data-testid="child-content">Content</div>
            </DrawerShell>
        );

        expect(screen.getByText('PTIS Assessment')).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Ward') && content.includes('W-10'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Property') && content.includes('P-101'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('Partition') && content.includes('0'))).toBeInTheDocument();
    });

    it('renders all navigation tabs', () => {
        render(
            <DrawerShell locale="en">
                <div>Content</div>
            </DrawerShell>
        );

        expect(screen.getByText('Property')).toBeInTheDocument();
        expect(screen.getByText('KYC')).toBeInTheDocument();
        expect(screen.getByText('Society')).toBeInTheDocument();
        expect(screen.getByText('Building Permission')).toBeInTheDocument();
        expect(screen.getByText('Floor')).toBeInTheDocument();
        expect(screen.getByText('Discount')).toBeInTheDocument();
        expect(screen.getByText('Old Details')).toBeInTheDocument();
    });

    it('highlights the active tab based on pathname', () => {
        // Path ends with /Society
        render(
            <DrawerShell locale="en">
                <div>Content</div>
            </DrawerShell>
        );

        const societyTab = screen.getByRole('link', { name: /society/i });
        expect(societyTab).toHaveClass('bg-purple-600'); // Based on current code logic
    });

    it('calls router.push when the close button is clicked', () => {
        render(
            <DrawerShell locale="en">
                <div>Content</div>
            </DrawerShell>
        );

        const closeButton = screen.getByTestId('icon-x').closest('button')!;
        fireEvent.click(closeButton);

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/en/property-tax/ptis'));
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('wardNo=W-10'));
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('propertyNo=P-101'));
    });

    it('hides header and tabs on Renter page', () => {
        vi.mocked(usePathname).mockReturnValueOnce('/en/property-tax/ptis/QuickDataEntry/123/Renter');

        render(
            <DrawerShell locale="en">
                <div data-testid="child-content">Content</div>
            </DrawerShell>
        );

        expect(screen.queryByText('PTIS Assessment')).not.toBeInTheDocument();
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
});
