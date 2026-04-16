
import FloorMaster from "@/components/modules/property-tax/Floormaster/floor/FloorMaster";
import { getFloorPaged } from "@/lib/api/floor.services";
import type { FloorPagedResponse } from "@/types/floor.types";

export const dynamic = "force-dynamic";


interface PageProps {
  readonly searchParams: {
    page?: string;
    pageSize?: string;
    q?: string;
  };
}


export default async function Page({
  searchParams,
}: PageProps) {
  const params = searchParams;

  const pageNumber = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 10;
  const searchQuery = params?.q || "";

  const result: FloorPagedResponse =
    await getFloorPaged(
      pageNumber,
      pageSize,
      searchQuery
    );

  return (
    <div className="p-6">
      <FloorMaster floorPaged={result} />
    </div>
  );
}
