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
 * Fetches paginated depreciation records with proper range-level pagination.
 * Since backend doesn't support range pagination, we implement hybrid approach:
 * 1. Fetch more records to ensure enough unique ranges
 * 2. Group records by ranges in memory  
 * 3. Paginate ranges (not records)
 * 4. Return all records belonging to paginated ranges
 */
export async function fetchRangesPagedServerAction(
  pageNumber: number,
  pageSize: number
): Promise<{
  success: boolean;
  data?: {
    rows: DepreciationRow[];
    constructionTypes: DepreciationConstructionType[];
    // Pagination info - range-level pagination
    rangePageNumber: number;
    rangePageSize: number;
    rangeTotalCount: number;
    rangeTotalPages: number;
  };
  error?: string;
}> {
  try {
    // Validate pagination parameters
    if (pageNumber <= 0 || pageSize <= 0) {
      return { success: false, error: 'Invalid pagination parameters' };
    }

    // Fetch enough records to get sufficient unique ranges
    // Since each range typically has multiple construction types,
    // we fetch more records than pageSize to ensure we get enough ranges
    const fetchSize = Math.max(pageSize * 10, 100); // Fetch 10x more records or minimum 100
    const maxPages = 10; // Safety limit
    
    const constructionTypes = await getConstructionTypes();
    const allRecordsForRanges: DepreciationRow[] = [];
    let currentPage = 1;
    
    // Fetch records until we have enough unique ranges or hit limits
    const uniqueRangesFound = new Set<string>();
    const targetRangeCount = pageNumber * pageSize; // Total ranges needed up to current page
    
    while (currentPage <= maxPages && uniqueRangesFound.size < targetRangeCount + pageSize) {
      const response = await getDepreciationPaged(currentPage, fetchSize);
      
      if (!response.items || response.items.length === 0) {
        break; // No more records
      }
      
      allRecordsForRanges.push(...response.items);
      
      // Track unique ranges found
      response.items.forEach(row => {
        uniqueRangesFound.add(`${row.minYear}-${row.maxYear}`);
      });
      
      // If we have enough ranges or no more pages, stop
      if (uniqueRangesFound.size >= targetRangeCount + pageSize || !response.hasNext) {
        break;
      }
      
      currentPage++;
    }

    // Group records by ranges
    const rangeMap = new Map<string, { minYear: number; maxYear: number; records: DepreciationRow[] }>();
    
    allRecordsForRanges.forEach((row) => {
      const key = `${row.minYear}-${row.maxYear}`;
      if (!rangeMap.has(key)) {
        rangeMap.set(key, {
          minYear: row.minYear,
          maxYear: row.maxYear,
          records: []
        });
      }
      rangeMap.get(key)!.records.push(row);
    });

    // Sort ranges by minYear and apply range-level pagination
    const allRanges = Array.from(rangeMap.values()).sort((a, b) => a.minYear - b.minYear);
    const rangeTotalCount = allRanges.length;
    const rangeTotalPages = Math.ceil(rangeTotalCount / pageSize) || 1;

    // Clamp pageNumber to valid range
    const clampedPageNumber = Math.min(pageNumber, rangeTotalPages);

    // Apply pagination to ranges (not records)
    const startIndex = (clampedPageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRanges = allRanges.slice(startIndex, endIndex);

    // Collect all records from paginated ranges
    const finalRows: DepreciationRow[] = [];
    paginatedRanges.forEach(range => {
      finalRows.push(...range.records);
    });

    return {
      success: true,
      data: {
        rows: finalRows,
        constructionTypes,
        rangePageNumber: clampedPageNumber,
        rangePageSize: pageSize,
        rangeTotalCount,
        rangeTotalPages,
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
