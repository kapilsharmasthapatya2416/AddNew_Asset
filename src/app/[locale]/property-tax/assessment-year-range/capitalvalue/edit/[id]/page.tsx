import { notFound } from "next/navigation";
import AssessmentYearFormCV from "@/components/modules/property-tax/AssessmentYearRange/CapitalValue/AssessmentYearFormCV";
import { getAssessmentYearByIdCV } from "@/lib/api/assessmentYearMasterCV.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAssessmentYearPageCV({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  // Guard against invalid id
  if (!resolvedParams.id || isNaN(id) || id <= 0) {
    notFound();
  }
  const data = await getAssessmentYearByIdCV(id);

  return (
    <AssessmentYearFormCV
      open={true}
      initialData={data}
      key={data.yearId}
    />
  );
}
