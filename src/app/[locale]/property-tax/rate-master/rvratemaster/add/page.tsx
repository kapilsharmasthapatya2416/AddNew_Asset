import { Suspense } from "react";
import {PageContainer} from "@/components/common/PageContainer";
import RateMasterView from "@/components/modules/property-tax/RVRateMaster/RateMasterView";
import AddRateDrawer from "@/components/modules/property-tax/RVRateMaster/AddRateDrawer";
import {getAssessmentYears, getConstructionTypes, getRateMasterTableData, getUseGroupOptions, getZoneDescriptionsPaged, getAllZoneDescriptions, getZoneOptions, getRateMasterByFilters } from "../action";

// Force dynamic rendering to ensure fresh data on each navigation
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{
    zone?: string;
    useGroup?: string;
    assessmentYear?: string;
    matrixPage?: string;
    matrixPageSize?: string;
  }>;
};

export default async function AddRatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Get matrix pagination params from URL
  const matrixPage = Number(params?.matrixPage) || 1;
  const matrixPageSize = Number(params?.matrixPageSize) || 10;
  
  const [
    zones,
    useGroups,
    paginatedZonesResult,
    allZonesResult,
    constructionTypes,
    assessmentYears,
    tableData,
    //assessmentYearRanges,
  ] = await Promise.all([
    getZoneOptions(),
    getUseGroupOptions(),
    getZoneDescriptionsPaged(matrixPage, matrixPageSize),
    getAllZoneDescriptions(), // Fetch all zones for copy rates functionality
    getConstructionTypes(),
    getAssessmentYears(),
    getRateMasterTableData(matrixPage, matrixPageSize),
    //getActiveAssessmentYearRanges(),
  ]);

  // Set initial values to first available options
  const initialZone = zones && zones.length > 0 ? zones[0].value : "ALL";
  const initialUseGroup = useGroups && useGroups.length > 0 ? useGroups[0].value : "ALL";
  const initialYear = assessmentYears && assessmentYears.length > 0 ? assessmentYears[0].value : "ALL";

  // Check for existing rates if filters are provided (for add mode validation)
  let initialExistingRatesCheck = false;
  if (params?.zone && params?.useGroup && params?.assessmentYear) {
    try {
      const existingRates = await getRateMasterByFilters(
        params.zone,
        params.useGroup,
        params.assessmentYear
      );
      initialExistingRatesCheck = existingRates && existingRates.length > 0;
    } catch {
      initialExistingRatesCheck = false;
    }
  }

  // Prepare paginated zones data for the form
  const paginatedZonesData = {
    items: paginatedZonesResult.items,
    totalPages: paginatedZonesResult.totalPages,
    totalCount: paginatedZonesResult.totalCount,
    pageNumber: matrixPage,
    pageSize: matrixPageSize,
  };


  // Convert assessmentYears to the expected format (ensure fromYear/toYear are strings)
  const assessmentYearRanges = assessmentYears.map(ay => ({
    ...ay,
    fromYear: String(ay.fromYear),
    toYear: String(ay.toYear),
  }));

  return (
    <>
      <PageContainer className="pt-24">
        <Suspense fallback={null}>
          <RateMasterView
            rateMasterData={tableData ?? []}
            zones={zones ?? []}
            useGroups={useGroups ?? []}
            assessmentYears={assessmentYears ?? []}
            rateCategories={constructionTypes.map((ct: { constructionId: string; constructionCode?: string; description?: string }) => ({ constructionId: ct.constructionId, constructionCode: ct.constructionCode, description: ct.description }))}
            initialZone={initialZone}
            initialUseGroup={initialUseGroup}
            initialYear={initialYear}
          />
        </Suspense>
      </PageContainer>
      <Suspense fallback={null}>
        <AddRateDrawer
          zones={zones}
          useGroups={useGroups}
          assessmentYears={assessmentYears}
          assessmentYearRanges={assessmentYearRanges}
          zoneDescriptions={paginatedZonesResult.items}
          allZones={allZonesResult}
          rateCategories={constructionTypes.map((ct: { constructionId: string; constructionCode?: string; description?: string }) => ({ constructionId: ct.constructionId, constructionCode: ct.constructionCode, description: ct.description }))}
          paginatedZonesData={paginatedZonesData}
          initialExistingRatesCheck={initialExistingRatesCheck}
        />
      </Suspense>
    </>
  );
}
