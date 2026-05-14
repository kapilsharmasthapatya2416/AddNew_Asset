import ValuationRenderer from '@/components/modules/asset/add-New-Asset/valuation/ValuationRenderer';
import { getValuationPageDataAction } from './actions';
import { ValuationPageData } from '@/types/valuation.types';

export default async function Page() {
  const { category, valuation, details }: ValuationPageData = await getValuationPageDataAction();

  return <ValuationRenderer category={category} valuation={valuation} details={details} />;
}
