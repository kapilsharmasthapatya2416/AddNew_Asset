'use server';

import { revalidatePath } from 'next/cache';
import {
  addDepreciationRangeBulk,
  deleteDepreciationRange,
  getConstructionTypes,
  getDepreciationPaged,
  syncDepreciationRatesFromPage,
} from '@/lib/api/depreciation.services';
import type { ActionResult, DepreciationConstructionType, DepreciationRow } from '@/types/depreciation.types';

/**
 * Path helper to ensure consistency across revalidations
 */
const getPagePath = (locale: string) => `/${locale}/property-tax/depreciation-master`;

/**
 * Fetches paginated depreciation records with proper server-side pagination.
 * Uses backend's native record-level pagination (not range-level).
 * UI should display record counts, not range counts, for accuracy.
 */
export async function fetchRangesPagedServerAction(
  pageNumber: number,
  pageSize: number
): Promise<{
  success: boolean;
  data?: {
    rows: DepreciationRow[];
    constructionTypes: DepreciationConstructionType[];
    // Pagination info - honest record-level pagination
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    // Additional info for UI
    rangeCountInCurrentPage: number;
  };
  error?: string;
}> {
  try {
    // Validate pagination parameters
    if (pageNumber <= 0 || pageSize <= 0) {
      return { success: false, error: 'Invalid pagination parameters' };
    }

    // Fetch records using backend's native pagination
    const [paginatedResponse, constructionTypes] = await Promise.all([
      getDepreciationPaged(pageNumber, pageSize),
      getConstructionTypes(),
    ]);

    const { items: rows, totalCount, totalPages } = paginatedResponse;

    // Clamp pageNumber to valid range (fix for delete-induced page overflow)
    const clampedPageNumber = Math.min(pageNumber, totalPages || 1);
    
    // If we clamped the page number, refetch with correct page
    let finalRows = rows;
    let finalTotalPages = totalPages;
    let finalTotalCount = totalCount;
    
    if (clampedPageNumber !== pageNumber && clampedPageNumber > 0) {
      const clampedResponse = await getDepreciationPaged(clampedPageNumber, pageSize);
      finalRows = clampedResponse.items;
      finalTotalPages = clampedResponse.totalPages;
      finalTotalCount = clampedResponse.totalCount;
    }

    // Count unique ranges in current page for display purposes
    const uniqueRanges = new Set<string>();
    (finalRows || []).forEach(row => {
      uniqueRanges.add(`${row.minYear}-${row.maxYear}`);
    });

    return {
      success: true,
      data: {
        rows: finalRows || [],
        constructionTypes,
        pageNumber: clampedPageNumber,
        pageSize: pageSize,
        totalRecords: finalTotalCount || 0,
        totalPages: finalTotalPages || 1,
        rangeCountInCurrentPage: uniqueRanges.size,
      },
    };
  } catch (error: unknown) {
    console.error('[fetchRangesPagedServerAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load depreciation data',
    };
  }
}

/**
 * @deprecated Use fetchRangesPagedServerAction for better performance
 * This function fetches all records which is inefficient for large datasets
 */
export async function getDepreciationScreenAction(): Promise<
  ActionResult<{
    constructionTypes: DepreciationConstructionType[];
    rows: DepreciationRow[];
  }>
> {
  console.warn('getDepreciationScreenAction is deprecated - use fetchRangesPagedServerAction instead');
  try {
    // This is inefficient - fetches all records
    const [constructionTypes, allRowsResponse] = await Promise.all([
      getConstructionTypes(),
      getDepreciationPaged(1, 1000), // Limit to first 1000 records as fallback
    ]);

    return {
      success: true,
      data: { constructionTypes, rows: allRowsResponse.items || [] },
    };
  } catch (error: unknown) {
    console.error('[getDepreciationScreenAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load screen data',
    };
  }
}

/**
 * Efficient Global Sync Action - uses only current page records
 * This handles the "Dirty Tracking" update with proper server-side pagination.
 * Only updates the records that were changed in the UI grid from current page.
 * @param locale - Current locale for revalidation 
 * @param currentPageRecords - Records currently loaded in the UI (from current page)
 * @param changes - Object mapping id to new rate value
 */
export async function syncDepreciationRatesAction(
  locale: string,
  currentPageRecords: DepreciationRow[],
  changes: Record<number, number>
): Promise<ActionResult> {
  try {
    if (!changes || Object.keys(changes).length === 0) return { success: true };

    await syncDepreciationRatesFromPage(currentPageRecords, changes);

    revalidatePath(getPagePath(locale));

    return { success: true };
  } catch (error: unknown) {
    console.error('[syncDepreciationRatesAction] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Sync failed' };
  }
}

/**
 * Action to add a new range across all construction types.
 * This creates a default row (rate 0) for every construction type in the new range.
 */
export async function addRangeAction(
  locale: string,
  payload: { minYear: number; maxYear: number; defaultRate?: number }
): Promise<ActionResult> {
  try {
    await addDepreciationRangeBulk(payload);

    revalidatePath(getPagePath(locale));

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Add range failed' };
  }
}

/**
 * Action to delete an entire range.
 * Deletes all construction type records associated with this min/max year.
 */
export async function deleteRangeAction(
  locale: string,
  payload: { minYear: number; maxYear: number }
): Promise<ActionResult> {
  try {
    await deleteDepreciationRange(payload);

    revalidatePath(getPagePath(locale));

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' };
  }
}
