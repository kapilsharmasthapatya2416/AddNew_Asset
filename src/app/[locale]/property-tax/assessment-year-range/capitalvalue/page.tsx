import { PageContainer } from "@/components/common";
import { MainLayout } from "@/components/layout";
import AssessmentYearMasterCV from "@/components/modules/property-tax/AssessmentYearRange/CapitalValue/AssessmentYearMasterCV";
import { getAssessmentYearsPagedServerCV } from "@/lib/api/assessmentYearMasterCV.service";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Sanitize and clamp pagination parameters to safe defaults
 */
function sanitizePaginationParams(params: { [key: string]: string | string[] | undefined }) {
  const rawPage = Number(params?.page);
  const rawSize = Number(params?.size);
  
  // Clamp page to valid range (minimum 1)
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  // Clamp size to valid range (1-100, default 10)
  const size = Number.isFinite(rawSize) && rawSize >= 1 && rawSize <= 100 ? Math.floor(rawSize) : 10;
  const search = (params?.search as string) || "";
  
  return { page, size, search };
}

export default async function CapitalValuePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { page, size, search } = sanitizePaginationParams(resolvedParams);

  const paginatedData = await getAssessmentYearsPagedServerCV(page, size, search);

  return (
    <MainLayout>
      <PageContainer>
        <AssessmentYearMasterCV paginatedData={paginatedData} />
      </PageContainer>
    </MainLayout>
  );
}
