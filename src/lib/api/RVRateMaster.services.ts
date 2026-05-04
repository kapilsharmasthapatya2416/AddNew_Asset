import { IRateMaster, IZoneDescription, RateCategory, IBackendRateMaster, IRateCreate } from "@/types/RVRateMaster";
import { PagedResponse } from "@/types/RVRateMaster";
import { apiClient } from "@/services/api.service";
import { ApiError } from "@/lib/utils/api";

// Re-export ApiError to maintain compatibility
export { ApiError };

/**
 * Bulk update rate master records (PUT /Rate/Bulk)
 * Accepts array of { id, data } objects as required by backend
 */
export async function bulkUpdateRateMaster(payload: Array<{ id: number, data: any }>): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await apiClient.put<{ data?: unknown }>(`/Rate/Bulk`, payload);
  if (!response.success) {
    throw new ApiError(response.statusCode || 500, "", response.error || 'Failed to bulk update rate master');
  }
  return { success: true, message: 'Bulk update successful', data: response.data };
}

/**
 * Fetch detailed rates from backend using /Rate/detailed endpoint
 * All params are optional except pageNumber and pageSize (default -1 for all)
 */
export async function getDetailedRates(
  rateSection?: string,
  useGroup?: string,
  assessmentYear?: string,
  pageNumber: number = 1,
  pageSize: number = -1
): Promise<any> {
  const params = new URLSearchParams();
  params.append('PageNumber', pageNumber.toString());
  params.append('PageSize', pageSize.toString());

  if (rateSection && rateSection !== "ALL" && !isNaN(Number(rateSection))) {
    params.append('RateSectionId', rateSection);
  }
  if (useGroup && useGroup !== "ALL" && !isNaN(Number(useGroup))) {
    params.append('TypeOfUseGroupId', useGroup);
  }
  if (assessmentYear && assessmentYear !== "ALL" && !isNaN(Number(assessmentYear))) {
    params.append('YearRangeRVId', assessmentYear);
  }

  const response = await apiClient.get(`/Rate/detailed?${params.toString()}`);
  if (!response.success || !response.data) {
    throw new ApiError(response.statusCode || 500, "", response.error || 'Failed to fetch detailed rates');
  }
  return response.data;
}

/**
 * Bulk create rate master records (POST /Rate/Bulk)
 * Backend expects an array of rate objects directly
 */
export async function bulkCreateRateMaster(payload: IRateCreate[]): Promise<{ success: boolean; message: string; data?: unknown }> {
  console.log('🔄 bulkCreateRateMaster calling POST /Rate/Bulk');
  console.log('  📊 Payload count:', payload?.length);
  if (payload?.length > 0) {
    console.log('  📊 Sample payload:', JSON.stringify(payload[0], null, 2));
  }
  
  const response = await apiClient.post<{ data?: unknown }>(`/Rate/Bulk`, payload);
  console.log('📥 API response:', { success: response.success, statusCode: response.statusCode, error: response.error });
  
  if (!response.success) {
    throw new ApiError(response.statusCode || 500, "", response.error || 'Failed to bulk create rate master');
  }
  return { success: true, message: 'Bulk create successful', data: response.data };
}

/* ========== GET REQUESTS (Data Fetching) ========== */

/**
 * Fetch paged rate master data for the main list
 */
export async function getRateMasterPaged(
  pageNumber: number,
  pageSize: number,
  constructionTypes: RateCategory[],
  zoneDescriptions: IZoneDescription[],
  rateSection?: string | { value: string },
  useGroup?: string | { value: string },
  assessmentYear?: string | { value: string }
): Promise<PagedResponse<IRateMaster>> {
  const params = new URLSearchParams({
    PageNumber: pageNumber.toString(),
    PageSize: pageSize.toString(),
  });

  function getValue(val?: string | { value: string }): string {
    if (!val) return '';
    if (typeof val === 'object' && val && 'value' in val) return val.value || '';
    return typeof val === 'string' ? val : '';
  }

  const rateSectionStr = getValue(rateSection);
  const useGroupStr = getValue(useGroup);
  const assessmentYearStr = getValue(assessmentYear);

  if (rateSectionStr && rateSectionStr !== "ALL" && rateSectionStr !== "undefined" && rateSectionStr.trim() !== "" && !isNaN(Number(rateSectionStr))) {
    params.append('RateSectionId', rateSectionStr);
  }
  if (useGroupStr && useGroupStr !== "ALL" && useGroupStr !== "undefined" && useGroupStr.trim() !== "" && !isNaN(Number(useGroupStr))) {
    params.append('TypeOfUseGroupId', useGroupStr);
  }
  if (assessmentYearStr && assessmentYearStr !== "ALL" && assessmentYearStr !== "undefined" && assessmentYearStr.trim() !== "" && !isNaN(Number(assessmentYearStr))) {
    params.append('YearRangeRVId', assessmentYearStr);
  }

  const response = await apiClient.get<PagedResponse<IBackendRateMaster>>(`/Rate?${params.toString()}`);
  if (!response.success || !response.data) {
    throw new ApiError(response.statusCode || 500, "", response.error || 'Failed to fetch paged rate data');
  }

  const data = response.data;
  const backendData: IBackendRateMaster[] = data.items || [];
  const taxZoneIdToNo = new Map(zoneDescriptions.map(z => [z.taxZoneId, String(z.zoneNo).trim()]));
  const groupedData = new Map<string, IRateMaster>();

  backendData.forEach((item) => {
    try {
      const taxZoneNo = String(taxZoneIdToNo.get(item.taxZoneId) || item.taxZoneNo || item.taxZoneId).trim();
      const typeOfUseGroupId = String(item.typeOfUseGroupId);
      const rateSectionNo = item.rateSectionNo || String(item.rateSectionId);
      const yearRangeRVId = item.yearRangeRVId || item.yearRangeId;
      const key = `${taxZoneNo}-${typeOfUseGroupId}-${item.year}-${yearRangeRVId}-${item.rateSectionId}`;

      if (!groupedData.has(key)) {
        const initialRates = constructionTypes.map(ct => ({
          rateCategory: ct.constructionCode || ct.constructionId,
          ratePerSqMtr: null
        }));

        groupedData.set(key, {
          id: String(item.Id),
          rateSection: rateSectionNo as any,
          zoneNo: taxZoneNo,
          useGroup: typeOfUseGroupId,
          assessmentYear: `${yearRangeRVId}`,
          rates: initialRates,
        });
      }

      const group = groupedData.get(key);
      if (group) {
        const constructionTypeId = Number(item.constructionTypeId);
        const construction = constructionTypes.find(ct => Number(ct.constructionId) === constructionTypeId);

        if (construction) {
          const constructionCode = construction.constructionCode || construction.constructionId;
          const rateIndex = group.rates.findIndex(r => r.rateCategory === constructionCode);

          if (rateIndex !== -1) {
            group.rates[rateIndex].ratePerSqMtr = item.rateSquareMeter;
            group.rates[rateIndex].id = item.Id;
          }
        }
      }
    } catch (error) {
      console.error('Error transforming rate item:', error);
    }
  });

  let transformedData = Array.from(groupedData.values());

  if (rateSectionStr && rateSectionStr !== "ALL" && rateSectionStr !== "undefined" && !isNaN(Number(rateSectionStr))) {
    const selectedRateSectionId = Number(rateSectionStr);
    transformedData = transformedData.filter(row => Number(row.rateSection) === selectedRateSectionId);
  }

  return {
    items: transformedData,
    totalCount: data.totalCount || 0,
    pageNumber: data.pageNumber || pageNumber,
    pageSize: data.pageSize || pageSize,
    totalPages: data.totalPages || 0,
    hasPrevious: data.hasPrevious || false,
    hasNext: data.hasNext || false,
  };
}

/**
 * Get all rate master data from backend (unpaged)
 */
export async function getRateMasterTableData(
  constructionTypes: RateCategory[],
  zoneDescriptions: IZoneDescription[]
): Promise<IRateMaster[]> {
  try {
    const response = await apiClient.get<PagedResponse<IBackendRateMaster>>(`/Rate?PageSize=-1`);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch rate master data');
    }

    const data = response.data;
    const backendData: IBackendRateMaster[] = data.items || [];
    const taxZoneIdToNo = new Map(zoneDescriptions.map(z => [z.taxZoneId, z.zoneNo]));
    const groupedData = new Map<string, IRateMaster>();

    backendData.forEach(item => {
      try {
        const taxZoneNo = taxZoneIdToNo.get(item.taxZoneId) || item.taxZoneNo || String(item.taxZoneId);
        const typeOfUseGroupId = String(item.typeOfUseGroupId);
        const rateSectionNo = item.rateSectionNo || String(item.rateSectionId);
        const yearRangeRVId = String(item.yearRangeRVId || item.yearRangeId);
        const key = `${taxZoneNo}-${typeOfUseGroupId}-${rateSectionNo}-${yearRangeRVId}-${item.year}`;

        if (!groupedData.has(key)) {
          groupedData.set(key, {
            id: String(item.Id),
            rateSection: rateSectionNo as any,
            zoneNo: taxZoneNo,
            assessmentYear: yearRangeRVId,
            useGroup: typeOfUseGroupId,
            rates: constructionTypes.map(ct => ({
              rateCategory: ct.constructionCode || ct.constructionId,
              ratePerSqMtr: null
            }))
          });
        }

        const rateMaster = groupedData.get(key)!;
        const constructionTypeId = Number(item.constructionTypeId);
        const construction = constructionTypes.find(ct => Number(ct.constructionId) === constructionTypeId);
        
        if (construction) {
          const constructionCode = construction.constructionCode || construction.constructionId;
          const rateIndex = rateMaster.rates.findIndex(r => r.rateCategory === constructionCode);
          if (rateIndex !== -1) {
            rateMaster.rates[rateIndex].ratePerSqMtr = item.rateSquareMeter;
            rateMaster.rates[rateIndex].id = item.Id;
          }
        }
      } catch (error) {
        console.error('Error processing rate item:', error);
      }
    });

    return Array.from(groupedData.values());
  } catch (error) {
    console.error('Error fetching rate master data:', error);
    return [];
  }
}

/**
 * Get rate master table columns configuration
 */
export async function getRateMasterColumns(constructionTypes: RateCategory[]) {
  return [
    { id: "zoneNo", label: "Zone No" },
    { id: "zoneDescription", label: "Zone Description" },
    ...constructionTypes.map(type => ({
      id: (type.constructionCode || type.constructionId).toLowerCase(),
      label: `${type.constructionCode || type.constructionId} (₹/Sq.mtr)`,
      title: type.description
    }))
  ];
}

/**
 * Get rate master record by ID
 */
export async function getRateMasterById(
  id: string,
  constructionTypes: RateCategory[],
  zoneDescriptions: IZoneDescription[]
): Promise<IRateMaster | null> {
  const allData = await getRateMasterTableData(constructionTypes, zoneDescriptions);
  return allData.find((item) => item.id === id) || null;
}

/**
 * Get rate master records by filters
 */
export async function getRateMasterByFilters(
  zoneSection: string,
  useGroup: string,
  assessmentYear: string
): Promise<IBackendRateMaster[]> {
  const params = new URLSearchParams({
    PageNumber: '1',
    PageSize: '1000',
  });

  if (zoneSection && zoneSection !== "ALL" && zoneSection !== "undefined" && !isNaN(Number(zoneSection))) {
    params.append('RateSectionId', zoneSection);
  }
  if (useGroup && useGroup !== "ALL" && useGroup !== "undefined" && !isNaN(Number(useGroup))) {
    params.append('TypeOfUseGroupId', useGroup);
  }
  if (assessmentYear && assessmentYear !== "ALL" && assessmentYear !== "undefined" && !isNaN(Number(assessmentYear))) {
    params.append('YearRangeRVId', assessmentYear);
  }

  const response = await apiClient.get<PagedResponse<IBackendRateMaster>>(`/Rate?${params.toString()}`);
  if (!response.success || !response.data) {
    throw new ApiError(response.statusCode || 500, "", response.error || 'Failed to fetch rate data by filters');
  }

  const data = response.data;
  return data.items || [];
}

/* ========== POST/PUT/DELETE REQUESTS (Mutations) ========== */

/**
 * Bulk purge rate master records (DELETE /Rate/Bulk/purge)
 */
export async function bulkPurgeRateMaster(ids: number[]): Promise<{ success: boolean; message: string; data?: unknown }> {
  console.log('🗑️ bulkPurgeRateMaster called with IDs:', ids);
  
  // Pass body through options parameter (RequestInit includes body property)
  const response = await apiClient.delete<unknown>(`/Rate/Bulk/purge`, {
    body: JSON.stringify(ids),
  });
  
  console.log('🗑️ Delete response:', response);
  
  if (!response.success) {
    console.error('❌ Delete failed:', response.error);
    throw new ApiError(response.statusCode || 500, "", response.error || 'Failed to bulk purge rate master');
  }
  
  console.log('✅ Delete successful');
  return { success: true, message: 'Bulk purge successful', data: response.data };
}
