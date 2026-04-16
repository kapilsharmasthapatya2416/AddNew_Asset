import SubFloorForm from "@/components/modules/property-tax/Floormaster/subfloor/SubFloorForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <SubFloorForm mode="add" />;
}