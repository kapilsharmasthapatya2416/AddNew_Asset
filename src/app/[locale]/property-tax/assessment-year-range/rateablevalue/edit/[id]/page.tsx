import { notFound } from "next/navigation";
import AssessmentYearForm from "@/components/modules/property-tax/AssessmentYearRange/RateableValue/AssessmentYearFormRV";
import { getAssessmentYearById, ApiError } from "@/lib/api/assessmentYearMaster.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAssessmentYearPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  // Guard against invalid id
  if (!resolvedParams.id || isNaN(id) || id <= 0) {
    notFound();
  }

  let data;
  try {
    data = await getAssessmentYearById(id);
  } catch (error) {
    // Only call notFound() for actual 404 errors; let other errors propagate to error boundary
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <AssessmentYearForm
      open={true}
      initialData={data}
      key={data.yearId}
    />
  );
}
