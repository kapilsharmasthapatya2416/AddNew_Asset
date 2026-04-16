import FloorForm from "@/components/modules/property-tax/Floormaster/floor/FloorForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <FloorForm mode="add" />
}