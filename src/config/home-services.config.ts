/**
 * Home Services Configuration
 * Centralized mapping for module icons and routes used in the Home screen.
 */

import {
    Home,
    Droplet,
    ShoppingCart,
    FileText,
    Trash2,
    Building2,
    Megaphone,
    Timer,
    Landmark
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';

/**
 * Icon component configuration for each module code
 */
export const HOME_SERVICE_ICONS: Record<string, {
    icon: LucideIcon;
    className: string;
}> = {
    'pt': { icon: Home, className: 'w-8 h-8 text-gray-700' },
    'wt': { icon: Droplet, className: 'w-8 h-8 text-blue-500 fill-blue-500' },
    'tl': { icon: ShoppingCart, className: 'w-8 h-8 text-orange-600' },
    'bd': { icon: FileText, className: 'w-8 h-8 text-amber-700' },
    'gc': { icon: Trash2, className: 'w-8 h-8 text-green-700' },
    'bp': { icon: Building2, className: 'w-8 h-8 text-purple-700' },
    'gr': { icon: Megaphone, className: 'w-8 h-8 text-red-600' },
    'rts': { icon: Timer, className: 'w-8 h-8 text-indigo-600' },
    'am': { icon: Landmark, className: 'w-8 h-8 text-teal-700' },
};

/**
 * Default icon configuration when module code is not found
 */
export const DEFAULT_SERVICE_ICON = { icon: Home, className: 'w-8 h-8 text-gray-700' };

/**
 * Maps API Module codes to UI Icon names (for backward compatibility)
 */
export const MODULE_ICON_MAP: Record<string, string> = {
    'pt': 'property-tax',
    'wt': 'water-tax',
    'tl': 'bajar-parwana',
    'bd': 'birth-death',
    'gc': 'garbage-collection',
    'bp': 'building-permission',
    'gr': 'grievance',
    'rts': 'rts',
    'am': 'assets',
};

/**
 * Maps API Module codes to UI Routes
 */
export const MODULE_ROUTE_MAP: Record<string, string> = {
    'pt': 'property-tax/ptis',
    'wt': 'water-tax',
    'tl': 'bajar-parwana',
    'bd': 'birth-death-certificates',
    'gc': 'garbage-collection',
    'bp': 'building-permission',
    'gr': 'grievance',
    'rts': 'rts',
    'am': 'assets',
};

/**
 * Helper function to get icon name for a module code
 */
export function getIconNameForModule(moduleCode: string): string {
    return MODULE_ICON_MAP[moduleCode.toLowerCase()] || 'property-tax';
}

/**
 * Helper function to get route for a module code
 */
export function getRouteForModule(moduleCode: string, locale: string): string {
    const route = MODULE_ROUTE_MAP[moduleCode.toLowerCase()];
    return route ? `/${locale}/${route}` : '#';
}
