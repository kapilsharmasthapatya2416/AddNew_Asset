import FloorForm from "@/components/modules/property-tax/Floormaster/floor/FloorForm";
import { getFloorById } from "@/lib/api/floor.services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
  const floor = await getFloorById(Number(params.id));
  
  return <FloorForm mode="edit" initialData={floor} />;
}