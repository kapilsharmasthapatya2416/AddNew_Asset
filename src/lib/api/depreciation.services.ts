import { appConfig } from '@/config/app.config';
import { createFetchOptions } from '@/lib/utils/api';
import type { 
  ConstructionType, 
  DepreciationRow,
  DepreciationPagedResponse
} from '@/types/depreciation.types';

const getUrl = (path: string): string => `${appConfig.api.baseUrl}${path}`;

const extractItems = (raw: any): any[] => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.items)) return raw.items;
  return [];
};

/**
 * Fetch paginated depreciation records (for range-wise pagination)
 * @param pageNumber - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated depreciation response
 */
export async function getDepreciationPaged(
  pageNumber: number,
  pageSize: number
): Promise<DepreciationPagedResponse> {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(
    getUrl(`/Depreciation?${params.toString()}`),
    createFetchOptions('GET')
  );

  if (!response.ok) {
    throw new Error('Failed to fetch paginated depreciation records');
  }

  const data = await response.json();

  // Handle both array and paginated response formats
  if (Array.isArray(data)) {
    const items = data.map((x) => ({
      depreciationId: Number(x.depreciationId),
      constructionTypeId: Number(x.constructionTypeId),
      minYear: Number(x.minYear),
      maxYear: Number(x.maxYear),
      rate: Number(x.rate),
    }));
    return {
      items,
      totalCount: items.length,
      pageNumber: 1,
      pageSize: items.length,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
    };
  }

  // Standard paginated response
  const items = extractItems(data).map((x) => ({
    depreciationId: Number(x.depreciationId),
    constructionTypeId: Number(x.constructionTypeId),
    minYear: Number(x.minYear),
    maxYear: Number(x.maxYear),
    rate: Number(x.rate),
  }));

  return {
    items,
    totalCount: data.totalCount || items.length,
    pageNumber: data.pageNumber || pageNumber,
    pageSize: data.pageSize || pageSize,
    totalPages: data.totalPages || Math.ceil((data.totalCount || items.length) / pageSize),
    hasPrevious: data.hasPrevious ?? (pageNumber > 1),
    hasNext: data.hasNext ?? (pageNumber < (data.totalPages || 1)),
  };
}

export async function getConstructionTypes(): Promise<ConstructionType[]> {
  const response = await fetch(getUrl('/ConstructionType?pageSize=5000'), createFetchOptions('GET'));
  if (!response.ok) throw new Error('Failed to fetch construction types');
  const raw = await response.json();
  return extractItems(raw)
    .map((x) => ({
      constructionId: Number(x.constructionTypeId),
      constructionCode: String(x.constructionCode ?? ''),
    }));
}

/**
 * Fetch all depreciation records (for bulk operations)
 * Handles API pagination by fetching all pages
 * @returns Array of all depreciation records
 */
export async function getDepreciationsAll(): Promise<DepreciationRow[]> {
  const allItems: DepreciationRow[] = [];
  let pageNumber = 1;
  const pageSize = 100; // API's max page size
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      _t: Date.now().toString(),
    });

    const response = await fetch(
      getUrl(`/Depreciation?${params.toString()}`),
      {
        ...createFetchOptions('GET'),
        cache: 'no-store',
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch depreciation records');
    const raw = await response.json();
    
    const items = extractItems(raw).map((x) => ({
      depreciationId: Number(x.depreciationId),
      constructionTypeId: Number(x.constructionTypeId),
      minYear: Number(x.minYear),
      maxYear: Number(x.maxYear),
      rate: Number(x.rate),
    }));
    
    allItems.push(...items);
    
    // Check if there are more pages
    hasMore = raw.hasNext === true && items.length > 0;
    pageNumber++;
    
    // Safety limit to prevent infinite loops
    if (pageNumber > 100) break;
  }

  console.log('[getDepreciationsAll] Total items fetched from all pages:', allItems.length);
  
  return allItems;
}

/***
 * NEW: Professional Sync for Global Grid Updates using Bulk API
 **/
export async function syncDepreciationRates(updates: Record<number, number>): Promise<void> {
  const allData = await getDepreciationsAll();

  const depreciations = Object.entries(updates)
    .map(([id, newRate]) => {
      const depId = Number(id);
      const existing = allData.find((d) => d.depreciationId === depId);

      if (!existing || existing.rate === newRate) return null;

      return {
        depreciationId: existing.depreciationId,
        minYear: existing.minYear,
        maxYear: existing.maxYear,
        constructionTypeId: existing.constructionTypeId,
        rate: newRate,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (depreciations.length === 0) return;

  await bulkUpdateDepreciationRates({
    depreciations,
    updatedBy: 0,
  });
}


export async function bulkCreateDepreciation(payload: {
  minYear: number;
  maxYear: number;
  rates: Array<{
    constructionTypeId: number;
    rate: number;
  }>;
  createdBy?: number;
}): Promise<void> {
  const url = getUrl('/Depreciation/bulk');
  console.log("🌐 [API] POST request to:", url);
  console.log("📤 [API] Request payload:", {
    minYear: payload.minYear,
    maxYear: payload.maxYear,
    ratesCount: payload.rates.length,
    createdBy: payload.createdBy || 0,
    sampleRate: payload.rates[0]
  });
  
  const response = await fetch(
    url, 
    createFetchOptions('POST', {
      minYear: payload.minYear,
      maxYear: payload.maxYear,
      rates: payload.rates,
      createdBy: payload.createdBy || 0
    })
  );
  
  console.log("📥 [API] Response status:", response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ [API] Error response:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Failed to create bulk depreciation records: ${response.status} - ${errorText}`);
  }
  
  console.log("✅ [API] Bulk create successful");
}

export async function addDepreciationRangeBulk(payload: {
  minYear: number;
  maxYear: number;
  defaultRate?: number;
}): Promise<void> {
  console.log("📦 [SERVICE] addDepreciationRangeBulk called:", payload);
  
  // Get all active construction types
  console.log("📞 [SERVICE] Fetching construction types...");
  const constructionTypes = await getConstructionTypes();
  console.log("✅ [SERVICE] Construction types fetched:", constructionTypes.length);
  
  // Create rates array for all construction types
  const rates = constructionTypes.map(type => ({
    constructionTypeId: type.constructionId,
    rate: payload.defaultRate || 0
  }));
  
  console.log("📊 [SERVICE] Rates array created:", { count: rates.length, sample: rates[0] });
  
  // Use bulk API to create all records at once
  console.log("📞 [SERVICE] Calling bulkCreateDepreciation API...");
  await bulkCreateDepreciation({
    minYear: payload.minYear,
    maxYear: payload.maxYear,
    rates: rates,
    createdBy: 0
  });
  
  console.log("✅ [SERVICE] addDepreciationRangeBulk completed successfully");
}

export async function deleteDepreciationRange(payload: {
  minYear: number;
  maxYear: number;
}): Promise<void> {
  const allData = await getDepreciationsAll();
  const targets = allData.filter(
    (x) => x.minYear === payload.minYear && x.maxYear === payload.maxYear
  );
  const depreciationIds = targets.map((row) => row.depreciationId);
  
  if (depreciationIds.length > 0) {
    await bulkDeleteDepreciations(depreciationIds);
  }
}

/**
 * Bulk update depreciation rates for multiple records
 * payload.depreciations: Array of { depreciationId, minYear, maxYear, constructionTypeId, rate }
 * payload.updatedBy: user id
 */
export async function bulkUpdateDepreciationRates(payload: {
  depreciations: Array<{
    depreciationId: number;
    minYear: number;
    maxYear: number;
    constructionTypeId: number;
    rate: number;
  }>;
  updatedBy?: number;
}): Promise<void> {
  const response = await fetch(
    getUrl('/Depreciation/bulk'),
    createFetchOptions('PUT', {
      depreciations: payload.depreciations,
      updatedBy: payload.updatedBy || 0
    })
  );
  if (!response.ok) {
    throw new Error('Failed to bulk update depreciation rates');
  }
}

/**
 * Bulk delete depreciation rates
 * @param depreciationIds - Array of depreciation IDs to delete
 */
export async function bulkDeleteDepreciations(depreciationIds: number[]): Promise<void> {
  const response = await fetch(
    getUrl('/Depreciation/bulk'),
    createFetchOptions('DELETE', {
      depreciationIds: depreciationIds
    })
  );
  
  if (!response.ok) {
    throw new Error('Failed to bulk delete depreciation records');
  }
}
