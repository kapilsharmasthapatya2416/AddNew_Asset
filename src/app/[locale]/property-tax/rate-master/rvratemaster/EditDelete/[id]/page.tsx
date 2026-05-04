import {PageContainer} from "@/components/common/PageContainer";
import RateMasterView from "@/components/modules/property-tax/RVRateMaster/RateMasterView";
import EditRateDrawer from "@/components/modules/property-tax/RVRateMaster/EditRateDrawer";
import {
  getZoneOptions,
  getUseGroupOptions,
  getZoneDescriptionsPaged,
  getAllZoneDescriptions,
  getConstructionTypes,
  getRateMasterById,
  getAssessmentYears,
  getRateMasterTableData,
  getRateMasterByFilters,
} from "@/app/[locale]/property-tax/rate-master/rvratemaster/action";

// Force dynamic rendering to ensure fresh data on each navigation
export const dynamic = 'force-dynamic';

export default async function EditRatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Get matrix pagination params from URL
  const matrixPage = Number(resolvedSearchParams?.matrixPage) || 1;
  const matrixPageSize = Number(resolvedSearchParams?.matrixPageSize) || 10;
  
  // Check if this is bulk edit (id === "bulk")
  const isBulkEdit = resolvedParams.id === "bulk";
  
  if (isBulkEdit) {
    // Bulk edit: fetch dropdown options and fetch rates based on URL filters
    const [zones, useGroups, paginatedZonesResult, allZonesResult, rateCategories, assessmentYears] =
      await Promise.all([
        getZoneOptions(),
        getUseGroupOptions(),
        getZoneDescriptionsPaged(matrixPage, matrixPageSize),
        getAllZoneDescriptions(), // Fetch all zones for copy rates functionality
        getConstructionTypes(),
        getAssessmentYears(),
      ]);


    // Get filter values from URL search params
    const urlZone = (resolvedSearchParams.zone as string) || "";
    const urlUseGroup = (resolvedSearchParams.useGroup as string) || "";
    const urlAssessmentYear = (resolvedSearchParams.assessmentYear as string) || (resolvedSearchParams.year as string) || "";

    // Use URL filters or fallback to first values (URL always takes precedence)
    const firstZone = urlZone || (zones && zones.length > 0 ? zones[0].value : "");
    const firstUseGroup = urlUseGroup || (useGroups && useGroups.length > 0 ? useGroups[0].value : "");
    const firstAssessmentYear = urlAssessmentYear || (assessmentYears && assessmentYears.length > 0 ? assessmentYears[0].value : "");
    
    const filterValues = {
      zone: firstZone,
      useGroup: firstUseGroup,
      year: firstAssessmentYear,
    };

    // Fetch backend rates based on URL filters (server-side)
    // This will re-fetch whenever URL params change via dropdown selections
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let backendRates: any[] = [];
    if (firstZone && firstUseGroup && firstAssessmentYear) {
      try {
        backendRates = await getRateMasterByFilters(
          firstZone,
          firstUseGroup,
          firstAssessmentYear
        );
        console.log(`✅ Server-side fetch: ${backendRates.length} rates found for zone=${firstZone}, useGroup=${firstUseGroup}, year=${firstAssessmentYear}`);
      } catch (error) {
        console.error('Error fetching rates for bulk edit:', error);
        backendRates = [];
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

    // Detect mode from searchParams
    const urlMode = typeof resolvedSearchParams.mode === "string" ? resolvedSearchParams.mode : "edit";
    return (
      <>
        <PageContainer className="pt-24">
          <RateMasterView
            rateMasterData={[]}
            zones={zones ?? []}
            useGroups={useGroups ?? []}
            assessmentYears={assessmentYears ?? []}
            rateCategories={rateCategories ?? []}
          
          />
        </PageContainer>
        <EditRateDrawer
          id="bulk"
          zones={zones}
          useGroups={useGroups}
          assessmentYears={assessmentYears}
          zoneDescriptions={paginatedZonesResult.items}
          allZones={allZonesResult} // All zones (unpaginated) for copy rates functionality
          rateCategories={rateCategories}
          bulkEditData={[]}
          backendRates={backendRates}
          filterValues={filterValues}
          mode={urlMode === "delete" ? "delete" : "edit"}
          paginatedZonesData={paginatedZonesData}
        />
      </>
    );
  }
  
  // Single record edit logic
  const [zones, useGroups, paginatedZonesResult, allZonesResult, rateCategories, assessmentYears, editData, tableData] =
    await Promise.all([
      getZoneOptions(),
      getUseGroupOptions(),
      getZoneDescriptionsPaged(matrixPage, matrixPageSize),
      getAllZoneDescriptions(), // Fetch all zones for copy rates functionality
      getConstructionTypes(),
      getAssessmentYears(),
      getRateMasterById(resolvedParams.id, matrixPage, matrixPageSize),
      getRateMasterTableData(matrixPage, matrixPageSize),
    ]);

  // Prepare paginated zones data for the form
  const paginatedZonesData = {
    items: paginatedZonesResult.items,
    totalPages: paginatedZonesResult.totalPages,
    totalCount: paginatedZonesResult.totalCount,
    pageNumber: matrixPage,
    pageSize: matrixPageSize,
  };

  return (
    <>
      <PageContainer className="pt-24">
        <RateMasterView
          rateMasterData={tableData ?? []}
          zones={zones ?? []}
          useGroups={useGroups ?? []}
          assessmentYears={assessmentYears ?? []}
          rateCategories={rateCategories ?? []}
       
        />
      </PageContainer>
      <EditRateDrawer
        id={resolvedParams.id}
        zones={zones}
        useGroups={useGroups}
        assessmentYears={assessmentYears}
        zoneDescriptions={paginatedZonesResult.items}
        allZones={allZonesResult} // All zones (unpaginated) for copy rates functionality
        rateCategories={rateCategories}
        editData={editData}
        filterValues={{
          zone: (resolvedSearchParams.zone as string) || editData?.rateSection || "",
          useGroup: (resolvedSearchParams.useGroup as string) || editData?.useGroup || "",
          year: (resolvedSearchParams.assessmentYear as string) || editData?.assessmentYear || "",        
        }}
        paginatedZonesData={paginatedZonesData}
      />
    </>
  );
}
