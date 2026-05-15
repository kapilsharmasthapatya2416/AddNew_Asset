import {
  Building2,
} from 'lucide-react';
import { SidebarSection, MenuItem } from '@/types/asset.types';

export const sidebarItems: MenuItem[] = [
  { id: 'assets', label: 'Municipal Assets', icon: Building2, route: '/asset/municipal-Asset' },
];

export const secondarySidebarItems: MenuItem[] = [];

export const ASSET_MENU_SECTIONS: SidebarSection[] = [];

export const routeMap = {
  'assets': '/asset/municipal-Asset',
};
