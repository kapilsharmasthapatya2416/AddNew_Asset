import { notFound } from "next/navigation";
import AssessmentYearForm from "@/components/modules/property-tax/AssessmentYearRange/RateableValue/AssessmentYearFormRV";
import { getAssessmentYearById } from "@/lib/api/assessmentYearMaster.service";

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
  const data = await getAssessmentYearById(id);

  return (
    <AssessmentYearForm
      open={true}
      initialData={data}
      key={data.yearId}
    />
  );
}
