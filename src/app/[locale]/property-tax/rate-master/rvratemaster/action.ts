'use server';

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";
import { IRateMaster, ISelectOption, IZoneDescription, RateCategory, AssessmentYearRangeOption, IRateCreate } from "@/types/RVRateMaster";
import * as rateMasterService from "@/lib/api/RVRateMaster.services";
import { queryRateSections } from "@/lib/api/rateSection.services";
import type { RateItem } from "@/types/rateSectionMaster.types";
import { getUseGroupsPagedServer } from "@/lib/api/typeofusemaster.service";
import { getAssessmentYearRangePaged } from "@/lib/api/assessment-year-range.service";
import { rateableValueConfig } from "@/components/modules/property-tax/assessment-year-range/config/rateableValue.config";
import { getTaxZonePagedServer } from "@/lib/api/taxzone.services";
import { getDetailedRates } from "@/lib/api/RVRateMaster.services";
import { getConstructionPaged } from "@/lib/api/construction-crud.service";

/* ========== DATA FETCHING (GET) ========== */
export async function getDetailedRatesAction(
  rateSection?: string,
  useGroup?: string,
  assessmentYear?: string,
  pageNumber: number = 1,
  pageSize: number = -1
) {
  try {
    return await getDetailedRates(rateSection, useGroup, assessmentYear, pageNumber, pageSize);
  } catch (error) {
    console.error("❌ Action Error [getDetailedRatesAction]:", error);
    throw new Error("Failed to fetch detailed rates. Please try again.");
  }
}

/**
 * Get paginated zone descriptions for matrix grid
 */
export async function getZoneDescriptionsPaged(
  pageNumber: number,
  pageSize: number
): Promise<{
  items: IZoneDescription[];
  totalPages: number;
  totalCount: number;
}> {
  try {
    const response = await getTaxZonePagedServer(pageNumber, pageSize);
    const items = response.items || [];
    
    const descriptions = items
      .filter((item: any) => item.isActive === true)
      .map((item: any) => ({
        taxZoneId: item.id || item.Id, // PK is 'Id' in TaxZoneMaster table
        zoneNo: String(item.taxZoneNo).trim(),
        description: String(item.remark || '').trim(),
      }));
    
    return {
      items: descriptions,
      totalPages: response.totalPages || 0,
      totalCount: response.totalCount || 0,
    };
  } catch (error) {
    console.error('❌ Action Error [getZoneDescriptionsPaged]:', error);
    throw error;
  }
}

/**
 * Get all zone descriptions (unpaged) for copy rates functionality
 */
export async function getAllZoneDescriptions(): Promise<IZoneDescription[]> {
  try {
    const response = await getTaxZonePagedServer(1, -1); // pageSize: -1 gets all items
    const items = response.items || [];
    
    // Debug: log raw API response to verify field names
    
    return items
      .filter((item: any) => item.isActive === true)
      .map((item: any) => ({
        taxZoneId: item.id || item.Id, // PK is 'Id' in TaxZoneMaster table
        zoneNo: String(item.taxZoneNo).trim(),
        description: String(item.remark || '').trim(),
      }));
  } catch (error) {
    console.error('❌ Action Error [getAllZoneDescriptions]:', error);
    throw error;
  }
}

/**
 * Get rate sections for dropdown
 */
export async function getZoneOptions(): Promise<ISelectOption[]> {
  try {
    const response = await queryRateSections({
      pageNumber: 1,
      pageSize: -1,
    });
    const items = response.rateSectionMaster || [];
    const activeItems = items.filter((item: RateItem) => item.isActive === true);
    
    return activeItems.map((item: RateItem) => ({
      label: item.description || "",
      value: String(item.rateSectionNo || ""),
    })).filter((opt: ISelectOption) => opt.value && opt.value !== 'undefined' && opt.value !== '0');
  } catch (error) {
    console.error('❌ Action Error [getZoneOptions]:', error);
    throw error;
  }
}

/**
 * Get use group dropdown options
 */
export async function getUseGroupOptions(): Promise<ISelectOption[]> {
  try {
    const response = await getUseGroupsPagedServer({
      pageNumber: 1,
      pageSize: -1,
    });
    
    const activeItems = (response.items || [])
      .filter(item => item.status === 'Active' && item.typeOfUseGroupId && item.typeOfUseGroupId > 0);
    
    return activeItems.map(item => ({
      label: item.groupName || String(item.typeOfUseGroupId),
      value: String(item.typeOfUseGroupId),
    })).filter(opt => opt.value && opt.value !== 'undefined' && opt.value !== '0');
  } catch (error) {
    console.error('❌ Action Error [getUseGroupOptions]:', error);
    throw error;
  }
}

/**
 * Get assessment years from backend API
 */
export async function getAssessmentYears(): Promise<AssessmentYearRangeOption[]> {
  try {
    const response = await getAssessmentYearRangePaged(rateableValueConfig, 1, 100);
    const items = response.items || [];
    
    return items
      .filter((item: any) => item.isActive === true && item.id)
      .map((item: any) => ({
        label: `${item.fromYear}-${item.toYear}`,
        value: String(item.id),
        fromYear: item.fromYear,
        toYear: item.toYear,
      }))
      .filter((opt: AssessmentYearRangeOption) => opt.value && opt.value !== 'undefined')
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('❌ Action Error [getAssessmentYears]:', error);
    throw error;
  }
}

/**
 * Get construction types from backend API
 */
export async function getConstructionTypes(): Promise<RateCategory[]> {
  try {
    const response = await getConstructionPaged(1, -1);
    const allItems = response.items || [];

    return allItems.map((item: any) => ({
      Id: item.id ?? item.Id,
      constructionId: String(item.id ?? item.Id),
      constructionCode: item.constructionCode,
      description: item.description || '',
      isActive: item.isActive,
    }));
  } catch (error) {
    console.error('❌ Action Error [getConstructionTypes]:', error);
    throw error;
  }
}

/**
 * Get rate master columns configuration
 */
export async function getRateMasterColumns() {
  const constructionTypes = await getConstructionTypes();
  return await rateMasterService.getRateMasterColumns(constructionTypes);
}

/**
 * Get all rate master table data
 */
export async function getRateMasterTableData(pageNumber: number = 1, pageSize: number = 10): Promise<IRateMaster[]> {
  const [constructionTypes, zoneDescriptionsResult] = await Promise.all([
    getConstructionTypes(),
    getZoneDescriptionsPaged(pageNumber, pageSize)
  ]);
  return await rateMasterService.getRateMasterTableData(constructionTypes, zoneDescriptionsResult.items);
}

/**
 * Get rate master data by ID
 */
export async function getRateMasterById(id: string, pageNumber: number = 1, pageSize: number = 10): Promise<IRateMaster | null> {
  const [constructionTypes, zoneDescriptionsResult] = await Promise.all([
    getConstructionTypes(),
    getZoneDescriptionsPaged(pageNumber, pageSize)
  ]);
  return await rateMasterService.getRateMasterById(id, constructionTypes, zoneDescriptionsResult.items);
}

/**
 * Get rate master records by filters
 */
export async function getRateMasterByFilters(
  zoneSection: string,
  useGroup: string,
  assessmentYear: string,
) {
  try {
    return await rateMasterService.getRateMasterByFilters(zoneSection, useGroup, assessmentYear);
  } catch (error: any) {
    console.error('❌ Action Error [getRateMasterByFilters]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rates. Please try again.';
    throw new Error(errorMessage);
  }
}

/**
 * Fetch all data required for the Rate Master page
 */
export async function getRateMasterData(pageNumber: number = 1, pageSize: number = 10) {
  try {
    const [
      constructionTypes,
      rateSections,
      useGroups,
      assessmentYears,
      zoneDescriptionsResult
    ] = await Promise.all([
      getConstructionTypes(),
      getZoneOptions(),
      getUseGroupOptions(),
      getAssessmentYears(),
      getZoneDescriptionsPaged(pageNumber, pageSize)
    ]);
    return {
      constructionTypes,
      rateSections,
      useGroups,
      assessmentYears,
      zoneDescriptions: zoneDescriptionsResult.items,
      totalPages: zoneDescriptionsResult.totalPages,
      totalCount: zoneDescriptionsResult.totalCount
    };
  } catch (error) {
    console.error('❌ Action Error [getRateMasterData]:', error);
    throw new Error('Failed to load RV Rate Master data. Please try again.');
  }
}

/* ========== MUTATIONS (POST/PUT/DELETE) ========== */

/**
 * Delete rate master record(s)
 */
export async function deleteRateMasterAction(backendRates: any[]) {  
  if (!backendRates || backendRates.length === 0) {
    return { success: false, message: 'No rates found to delete.' };
  }
  const ids = backendRates
    .map(rate => rate.Id || rate.id)
    .filter(id => id && id > 0);

  if (ids.length === 0) {
    return { success: false, message: 'No valid rate IDs found to delete.' };
  }
  try {
    const result = await rateMasterService.bulkPurgeRateMaster(ids);    
    if (result.success) {
      for (const locale of locales) {
        revalidatePath(`/${locale}/property-tax/rate-master/rvratemaster`);
      }
    }
    return result;
  } catch (error) {
    console.error('❌ Action Error [deleteRateMasterAction]:', error);
    return { success: false, message: 'Failed to delete rates. Please try again.' };
  }
}

/**
 * Bulk create rate master records
 */
export async function bulkCreateRateMasterAction(
  rates: IRateCreate[]
): Promise<{ success: boolean; message?: string; data?: unknown }> {
  // Wrap everything in try-catch to ensure we always return a serializable response
  try {   
   // Validate input
    if (!rates) {
      // console.log removed
      return { success: false, message: 'No rates data received.' };
    }
    
    if (!Array.isArray(rates)) {
      // console.log removed
      return { success: false, message: 'Invalid rates data format. Expected an array.' };
    }
    
    if (rates.length === 0) {
      // console.log removed
      return { success: false, message: 'No rates to create. Please enter at least one rate value.' };
    }
    
    // console.log removed

    const result = await rateMasterService.bulkCreateRateMaster(rates);
    // console.log removed
    
    if (result.success) {
      for (const locale of locales) {
        revalidatePath(`/${locale}/property-tax/rate-master/rvratemaster`);
      }
      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || 'Failed to create rates' };
  } catch (error: unknown) {
    console.error('❌ Action Error [bulkCreateRateMasterAction]:', error);
    
    // Handle ApiError specifically
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const apiError = error as { statusCode: number; message?: string };
      if (apiError.statusCode === 409) {
        return { success: false, message: 'A record with the same details already exists.' };
      }
    }
    
    // Return a serializable error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to create rates. Please try again.';
    return { success: false, message: errorMessage };
  }
}

/**
 * Bulk update rate master records
 */
export async function bulkUpdateRateMasterAction(
  payload: Array<{ id: number, data: any }>
): Promise<{ success: boolean; message?: string; data?: unknown }> {
  try {
    if (!payload || payload.length === 0) {
      return { success: false, message: 'No rates to update. Please enter at least one rate value.' };
    }

    const result = await rateMasterService.bulkUpdateRateMaster(payload);
    
    if (result.success) {
      for (const locale of locales) {
        revalidatePath(`/${locale}/property-tax/rate-master/rvratemaster`);
      }
      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || 'Failed to update rates' };
  } catch (error) {
    console.error('❌ Action Error [bulkUpdateRateMasterAction]:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to update rates. Please try again.' };
  }
}
