
import SubFloorForm from "@/components/modules/property-tax/Floormaster/subfloor/SubFloorForm";
import { getSubFloorById } from "@/lib/api/floor.services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  readonly params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const subFloor = await getSubFloorById(Number(params.id));
  
  return <SubFloorForm mode="edit" initialData={subFloor} />;
}
