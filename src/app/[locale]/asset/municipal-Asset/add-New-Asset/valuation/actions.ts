'use server';

import { getValuationPageData } from '@/lib/api/asset/valuation.service';

export async function getValuationPageDataAction() {
  return getValuationPageData();
}
