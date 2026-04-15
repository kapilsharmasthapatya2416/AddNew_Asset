import TaxZoningPage from "@/components/modules/property-tax/taxzoningmaster/TaxZoningPage";

import { fetchTaxZonePagedAction, fetchWardPagedAction, getAllTaxZonningAction, getTaxZonningPropertyNoPagedAction } from "./actions";

// Force dynamic rendering - this page requires runtime API data
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const pageNumber = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) ||5;

  // ✅ CALL ACTION (not server service)
  const result = await getTaxZonningPropertyNoPagedAction(
    pageNumber,
    pageSize
  );
  // Fetch all TaxZonning properties (no ward filter - will be filtered client-side)
  const allPropertiesOptions = await getAllTaxZonningAction(1, -1);

  // Await all server data
  const [taxZonesResult, wardsDataResult] = await Promise.all([
    fetchTaxZonePagedAction(1, -1),
    fetchWardPagedAction(1, -1)

  ]);

  const tableData = result.success && result.data ? result.data.items : [];
  const totalCount = result.success && result.data ? result.data.totalCount : 0;
  const totalPages = result.success && result.data ? result.data.totalPages : 1;

  return (
    <TaxZoningPage
      data={tableData}
      pageNumber={pageNumber}
      pageSize={pageSize}
      totalCount={totalCount}
      totalPages={totalPages}
      taxZones={taxZonesResult}
      wardsData={wardsDataResult}
      allProperties={allPropertiesOptions}
    />
  );
}
