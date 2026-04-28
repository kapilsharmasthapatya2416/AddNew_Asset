import type { UserScreenAccess } from '@/types/user-screen-access.types';

export interface SubMenuItem {
  name: string;
  href: string;
  className?: string;
}

/** Serializable for Server → Client Components: use `iconName` only (Lucide export name). */
export interface MenuItem {
  name: string;
  nameHi: string;
  iconName?: string;
  href: string;
  subItems?: SubMenuItem[];
}

export const defaultMenuItems: MenuItem[] = [
  { name: 'Dashboard', nameHi: 'डॅशबोर्ड', iconName: 'Home', href: '/dashboard' },
  { name: 'Data Analytics', nameHi: 'डेटा विश्लेषण', iconName: 'BarChart3', href: '/analytics' },
  { name: 'Search Property', nameHi: 'मालमत्ता शोध', iconName: 'Search', href: '/search-property' },
  { name: 'PTIS', nameHi: 'पी.टी.आय.एस.', iconName: 'LayoutDashboard', href: '/property-tax/ptis' },
  {
    name: 'Assessment Process',
    nameHi: 'करनिर्धारण प्रक्रिया',
    iconName: 'ClipboardCheck',
    href: '/assessment',
    subItems: [
      { name: 'Data Center', href: '/assessment/data-center' },
      { name: 'ULB Approval', href: '/assessment/ulb-approval' },
      { name: 'Hearing Application', href: '/assessment/hearing-application' },
      { name: 'Auto Appeal', href: '/assessment/auto-appeal' },
      { name: 'Hearing Approval', href: '/assessment/hearing-approval' },
    ],
  },
  { name: 'Report Engine', nameHi: 'अहवाल इंजिन', iconName: 'FileText', href: '/report-engine' },
  {
    name: 'Utility',
    nameHi: 'उपयोगिता',
    iconName: 'Wrench',
    href: '/utility',
    subItems: [
      { name: 'Lock Property', href: '/utility/lock-property' },
      { name: 'Add Taxes', href: '/utility/add-taxes' },
      { name: 'Auto Ward Entry', href: '/utility/auto-ward-entry' },
      { name: 'Update Common Details', href: '/utility/update-common-details' },
      { name: 'Delete Property', href: '/utility/delete-property' },
      { name: 'QR Generation', href: '/utility/qr-generation' },
      { name: 'Data Import', href: '/utility/data-import' },
    ],
  },
  {
    name: 'Services',
    nameHi: 'सेवा',
    iconName: 'LayoutGrid',
    href: '/services',
    subItems: [
      { name: 'Pay Property Tax', href: '/services/pay-property-tax' },
      { name: 'Pay Water Tax', href: '/services/pay-water-tax' },
      { name: 'Pay Trade Licence Fee', href: '/services/pay-trade-license' },
      { name: 'RTS', href: '/services/rts' },
      { name: 'RTI', href: '/services/rti' },
      { name: 'IGR', href: '/services/igr' },
      { name: 'Aaple Sarkar', href: '/services/aaple-sarkar' },
    ],
  },
  { name: 'GIS', nameHi: 'जी.आय.एस.', iconName: 'Map', href: '/gis' },
  { name: 'Master', nameHi: 'मास्टर', iconName: 'Database', href: '/master' },
  { name: 'User Management', nameHi: 'वापरकर्ता व्यवस्थापन', iconName: 'Users', href: '/user-management' },
];

export const getIconNameForScreen = (screenName: string, moduleName: string): string => {
  const sName = screenName.toLowerCase();
  const mName = moduleName.toLowerCase();

  if (sName.includes('bank')) return 'Database';
  if (sName.includes('financial') || sName.includes('year')) return 'BarChart3';
  if (sName.includes('office')) return 'LayoutGrid';
  if (sName.includes('payment')) return 'FileText';
  if (sName.includes('screen')) return 'LayoutDashboard';
  if (sName.includes('config') || sName.includes('setting')) return 'Wrench';
  if (sName.includes('user') || sName.includes('management')) return 'Users';
  if (sName.includes('search')) return 'Search';
  if (sName.includes('report')) return 'FileText';
  if (sName.includes('gis')) return 'Map';
  if (sName.includes('master') || mName.includes('master')) return 'Database';
  if (mName.includes('assessment')) return 'ClipboardCheck';
  if (mName.includes('analytics')) return 'BarChart3';
  if (mName.includes('dashboard')) return 'LayoutDashboard';
  if (mName.includes('utility')) return 'Wrench';

  return 'LayoutGrid';
};

export const transformScreensToMenuItems = (screens: UserScreenAccess[]): MenuItem[] => {
  const menuScreens = screens.filter((s) => s.isMenu);

  return menuScreens.map((screen) => {
    let href = screen.routePath;
    // Only allow internal links (must start with /)
    if (!href || !href.startsWith('/')) {
      href = '/';
    }

    if (screen.screenName.toUpperCase() === 'PTIS') {
      href = '/property-tax/ptis';
    }

    return {
      name: screen.screenName,
      nameHi: screen.screenNameLocal || screen.screenName,
      iconName: getIconNameForScreen(screen.screenName, screen.moduleName),
      href: href || '#',
      subItems: [],
    };
  });
};
