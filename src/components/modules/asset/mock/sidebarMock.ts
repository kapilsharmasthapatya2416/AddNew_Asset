import {
  LayoutDashboard,
  Map,
  Building2,
  RefreshCw,
  Database,
  Gavel,
  Zap,
  ClipboardCheck,
  ShieldAlert,
  Users,
  CreditCard,
  FileText,
  Rocket,
  BarChart3,
  TrendingUp,
  Send,
  ClipboardList,
  Wrench,
  Package,
} from 'lucide-react';
import { SidebarSection } from '@/types/asset.types';

export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'map', label: 'GIS Map Viewer', icon: Map, route: '/map-viewer' },
  { id: 'assets', label: 'Municipal Assets', icon: Building2, route: '/assets' },
];

export const secondarySidebarItems = [
  { id: 'change-detection', label: 'Change Detection', icon: RefreshCw, route: '/change-detection' },
];

export const ASSET_MENU_SECTIONS: SidebarSection[] = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    colorClass: 'text-yellow-400',
    items: [
      { id: 'maintenance-dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/maintenance/dashboard' },
      { id: 'maintenance-asset-master', label: 'Asset Master', icon: Database, route: '/maintenance/asset-master' },
      { id: 'maintenance-requests', label: 'Request Details', icon: FileText, route: '/maintenance/request-details' },
      { id: 'maintenance-inception', label: 'Inception', icon: Rocket, route: '/maintenance/inception' },
      { id: 'maintenance-reports', label: 'Reports', icon: BarChart3, route: '/maintenance/reports' },
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: Package,
    colorClass: 'text-rose-400',
    items: [
      { id: 'inventory-manage',   label: 'Manage Inventory', icon: TrendingUp,   route: '/inventory-dashboard' },
      { id: 'inventory-request',  label: 'Item Request',     icon: Send,          route: '/inventory-request' },
      { id: 'inventory-approval', label: 'Req. Approval',    icon: ClipboardList, route: '/inventory-approval' },
    ]
  },
  {
    id: 'auctions',
    label: 'Asset Auctions',
    icon: Gavel,
    colorClass: 'text-blue-400',
    items: [
      { id: 'auction-management', label: 'Auction Management', icon: Gavel, route: '/auction-management' },
      { id: 'live-bidding', label: 'Live Bidding', icon: Zap, route: '/live-bidding' },
      { id: 'verify-registrations', label: 'Verify Registrations', icon: ClipboardCheck, route: '/verify-registrations' },
      { id: 'blacklist-defaulters', label: 'Blacklist & Defaulters', icon: ShieldAlert, route: '/blacklist-defaulters' },
    ]
  },
  {
    id: 'revenue',
    label: 'Revenue Management',
    icon: CreditCard,
    colorClass: 'text-green-400',
    items: [
      { id: 'manage-renters', label: 'Manage Renters Details', icon: Users, route: '/lease-rent-registration' },
      { id: 'make-payments', label: 'Payment', icon: CreditCard, route: '/payment-management' },
    ]
  }
];

export const routeMap = {
  'dashboard': '/dashboard',
  'asset-register': '/asset-register',
  'map': '/map-viewer',
  'assets': '/assets',
  'maintenance': '/maintenance/dashboard',
  'maintenance-dashboard': '/maintenance/dashboard',
  'maintenance-asset-master': '/maintenance/asset-master',
  'maintenance-requests': '/maintenance/request-details',
  'maintenance-inception': '/maintenance/inception',
  'maintenance-reports': '/maintenance/reports',
  'change-detection': '/change-detection',
  'inventory': '/inventory',
  'inventory-dashboard': '/inventory-dashboard',
  'inventory-manage': '/inventory-dashboard',
  'inventory-request': '/inventory-request',
  'inventory-approval': '/inventory-approval',
  'configuration': '/asset/configuration',
  'auction-management': '/auction-management',
  'live-bidding': '/live-bidding',
  'verify-registrations': '/verify-registrations',
  'blacklist-defaulters': '/blacklist-defaulters',
  'manage-renters': '/lease-rent-registration',
  'make-payments': '/payment-management',
};
