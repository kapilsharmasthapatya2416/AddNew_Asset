import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceCards from '@/components/modules/home/ServiceCards';
import { Service } from '@/types/home/home.types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockServices: Service[] = [
  {
    id: 1,
    link: '/property-tax',
    icon: 'property-tax',
    title: 'Property Tax',
    subtext: 'Pay your property tax online',
    stats: [{ label: 'Due', value: '₹5000' }],
  },
  {
    id: 2,
    link: '/water-tax',
    icon: 'water-tax',
    title: 'Water Tax',
    subtext: 'Pay your water tax online',
    stats: [{ label: 'Due', value: '₹1000' }],
  },
  {
    id: 3,
    link: '/garbage-collection',
    icon: 'garbage-collection',
    title: 'Garbage Collection',
    subtext: 'Schedule garbage collection',
  },
];

describe('ServiceCards Component', () => {
  it('renders service cards for provided services', () => {
    render(<ServiceCards services={mockServices} />);
    expect(screen.getByText('Property Tax')).toBeInTheDocument();
    expect(screen.getByText('Water Tax')).toBeInTheDocument();
    expect(screen.getByText('Garbage Collection')).toBeInTheDocument();
  });

  it('renders nothing when services array is empty', () => {
    const { container } = render(<ServiceCards services={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when services is undefined', () => {
    const { container } = render(<ServiceCards />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct links for each service', () => {
    render(<ServiceCards services={mockServices} />);
    const propertyTaxLink = screen.getByText('Property Tax').closest('a');
    const waterTaxLink = screen.getByText('Water Tax').closest('a');
    expect(propertyTaxLink).toHaveAttribute('href', '/property-tax');
    expect(waterTaxLink).toHaveAttribute('href', '/water-tax');
  });

  it('renders subtext for each service', () => {
    render(<ServiceCards services={mockServices} />);
    expect(screen.getByText('Pay your property tax online')).toBeInTheDocument();
    expect(screen.getByText('Pay your water tax online')).toBeInTheDocument();
  });

  it('renders stats badges when provided', () => {
    render(<ServiceCards services={mockServices} />);
    expect(screen.getByText('Due: ₹5000')).toBeInTheDocument();
    expect(screen.getByText('Due: ₹1000')).toBeInTheDocument();
  });

  it('renders correct number of service cards', () => {
    render(<ServiceCards services={mockServices} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('applies responsive grid classes', () => {
    const { container } = render(<ServiceCards services={mockServices} />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass(
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-3'
    );
  });

  it('renders section with correct styling', () => {
    const { container } = render(<ServiceCards services={mockServices} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('w-full', 'min-h-[400px]');
  });

  it('renders cards with left border styling', () => {
    const { container } = render(<ServiceCards services={mockServices} />);
    const cards = container.querySelectorAll('.border-l-\\[6px\\]');
    expect(cards).toHaveLength(3);
  });
});

describe('ServiceCards Icon Mapping', () => {
  const iconTestCases = [
    { icon: 'property-tax', title: 'Property Tax' },
    { icon: 'water-tax', title: 'Water Tax' },
    { icon: 'bajar-parwana', title: 'Bajar Parwana' },
    { icon: 'birth-death', title: 'Birth Death' },
    { icon: 'garbage-collection', title: 'Garbage Collection' },
    { icon: 'building-permission', title: 'Building Permission' },
    { icon: 'grievance', title: 'Grievance' },
    { icon: 'rts', title: 'RTS' },
    { icon: 'assets', title: 'Assets' },
    { icon: 'unknown', title: 'Unknown Service' },
  ];

  iconTestCases.forEach(({ icon, title }) => {
    it(`renders icon for ${icon}`, () => {
      const service: Service[] = [
        {
          id: 1,
          link: '/test',
          icon,
          title,
          subtext: 'Test subtext',
        },
      ];
      render(<ServiceCards services={service} />);
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
