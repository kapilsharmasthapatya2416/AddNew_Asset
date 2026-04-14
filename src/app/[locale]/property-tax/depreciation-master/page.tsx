
import DepreciationMaster from "@/components/modules/property-tax/depreciation-master/DepreciationMaster";
import { fetchRangesPagedServerAction } from "./actions";
import { getTranslations } from 'next-intl/server';
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

interface PageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  noStore();
  
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Parse pagination parameters for ranges (default 5 ranges per page)
  const pageNumber = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) || 5;

  // Fetch paginated ranges data (server-side pagination for unique ranges)
  const res = await fetchRangesPagedServerAction(pageNumber, pageSize);
  
  if (!res.success || !res.data) {
    const t = await getTranslations('depreciationMaster.errors');
    return <div>{t('load')}</div>;
  }

  return (
    <DepreciationMaster
      data={res.data.rows}
      constructionTypes={res.data.constructionTypes}
      pageNumber={res.data.rangePageNumber}
      pageSize={res.data.rangePageSize}
      totalCount={res.data.rangeTotalCount}
      totalPages={res.data.rangeTotalPages}
      locale={locale}
    />
  );
}