import TaxZoningPage from "@/components/modules/property-tax/taxzoningmaster/TaxZoningPage";

import { fetchTaxZonePagedAction, fetchWardPagedAction, getTaxZonningPropertyNoPagedAction } from "./tax-zone.actions";


interface PageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = searchParams;

  const pageNumber = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  // ✅ CALL ACTION (not server service)
  const result = await getTaxZonningPropertyNoPagedAction(
    pageNumber,
    pageSize
  );

  // Await all server data
  const [taxZonesResult, wardsDataResult] = await Promise.all([
    fetchTaxZonePagedAction(1, 1000),
    fetchWardPagedAction(1, 5000)
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
        />
    );
}
