/**
 * Sidebar Service for Asset Module
 * Following the src/lib/api/[module] pattern with screen-specific files
 */

import { sidebarItems, secondarySidebarItems, ASSET_MENU_SECTIONS } from '@/components/modules/asset/mock/sidebarMock';

/**
 * Fetches the sidebar configuration for the Asset module
 * This can be made dynamic later by calling a backend menu API
 */
export async function getAssetSidebarConfig() {
  // In a real implementation:
  // const response = await apiClient.get('/Asset/Sidebar/Config');
  // return response.data;

  // Returning the structured mock data as a placeholder for the backend response
  return {
    mainItems: sidebarItems,
    secondaryItems: secondarySidebarItems,
    sections: ASSET_MENU_SECTIONS,
  };
}

/**
 * Checks permissions for specific sidebar screens
 */
export async function checkAssetScreenPermissions(userId: string, screenPath: string): Promise<boolean> {
  // Mock logic: for now, all paths are allowed in development
  console.log(`Checking permissions for User: ${userId} on Path: ${screenPath}`);
  return true;
}
