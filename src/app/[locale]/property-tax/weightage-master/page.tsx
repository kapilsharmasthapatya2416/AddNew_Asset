import React from "react";
import FloorCvWeightageMaster from "@/components/modules/property-tax/weightage-mastercv/FloorCvWeightageMaster";
import { fetchFloorFactorCVMasterPagedServerAction } from "./action";
import { getAssessmentYearsPagedServerCV, getFloorPaged } from "@/lib/api/floor-cv-weightageMaster.service";


interface PageProps {
  searchParams?: {
    page?: string;
    pageSize?: string;
    q?: string;
    selectedYearRange?: string;
  };
}

export default async function Page({ searchParams }: PageProps): Promise<React.ReactElement> {
  const params =await searchParams ?? {};
  // Clamp and sanitize pagination params
  let pageNumber = Number(params.page);
  let pageSize = Number(params.pageSize);
  // Clamp pageNumber to at least 1
  if (!Number.isFinite(pageNumber) || pageNumber < 1) pageNumber = 1;
  // Clamp pageSize to between 1 and 100
  if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = 10;
  else if (pageSize > 100) pageSize = 100;
  const searchTerm = params.q || undefined;
  const selectedYearRange = params.selectedYearRange || undefined;

  // Fetch assessment years for dropdowns
  const assessmentYearData = await getAssessmentYearsPagedServerCV(1, -1);
  const assessmentYearOptions = assessmentYearData.items.map((year) => ({
    label: `${year.fromYear}-${year.toYear}`,
    value: year.id.toString(),
  }));

  const result = await fetchFloorFactorCVMasterPagedServerAction(pageNumber, pageSize, searchTerm, selectedYearRange);

  // Fetch floor data for dropdowns
  const floorData = await getFloorPaged(1, -1); // Fetch all floors
  const floorOptions = floorData.items.map((floor) => ({
    label: `${floor.floorCode} - ${floor.description}`,
    value: floor.id.toString(),
  }));

  return (
    <div className="pt-6">
      <FloorCvWeightageMaster
        data={result.items}
        pageNumber={result.pageNumber}
        pageSize={result.pageSize}
        totalCount={result.totalCount}
        totalPages={result.totalPages}
        floorOptions={floorOptions}
        assessmentYearOptions={assessmentYearOptions}
      />
    </div>
  );
}