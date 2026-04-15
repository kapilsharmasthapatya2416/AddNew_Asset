import TaxZoneForm from "@/components/modules/property-tax/taxzonemaster/TaxZoneForm";
import { getTaxZoneByIdAction } from "../../action";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    taxZoneId: string;
  }>;
}

export default async function EditPage({ params }: PageProps) {
  const { taxZoneId } = await params;

  // ✅ Fetch data server-side by tax zone ID
  let taxZoneData: Awaited<ReturnType<typeof getTaxZoneByIdAction>> | null = null;
  try {
    taxZoneData = await getTaxZoneByIdAction(taxZoneId);
  } catch (error) {
    console.error("Failed to fetch tax zone:", error);
    notFound();
  }

  return (
    <>
      <TaxZoneForm initialData={taxZoneData} />
    </>
  );
}
