import {
  Building2,
} from 'lucide-react';
import { SidebarSection } from '@/types/asset.types';

export const sidebarItems = [
  { id: 'assets', label: 'Municipal Assets', icon: Building2, route: '/asset/municipal-Asset' },
];

export const secondarySidebarItems = [];

export const ASSET_MENU_SECTIONS: SidebarSection[] = [];

export const routeMap = {
  'assets': '/asset/municipal-Asset',
};
