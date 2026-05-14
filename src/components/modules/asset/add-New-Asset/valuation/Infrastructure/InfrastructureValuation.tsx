'use client';

import { useMemo, useState } from 'react';
import InfrastructureSummary from './InfrastructureSummary';
import InfrastructureBreakdown from './InfrastructureBreakdown';
import { ValuationRendererProps } from '@/types/valuation.types';

export default function InfrastructureValuation({
  details,
}: Pick<ValuationRendererProps, 'valuation' | 'details'>) {
  const [constructionCostPerMeter, setConstructionCostPerMeter] = useState(0);
  const [annualMaintenanceCost, setAnnualMaintenanceCost] = useState(0);

  const totalLength = Number(details?.totalLength ?? 0);
  const averageWidth = Number(details?.averageWidth ?? 0);
  const assetAge = Number(details?.assetAge ?? 16);

  const replacementCost = useMemo(() => {
    return totalLength * constructionCostPerMeter;
  }, [totalLength, constructionCostPerMeter]);

  const depreciationRate = 2;
  const maxDepreciationPercent = 50;

  const depreciationPercent = Math.min(assetAge * depreciationRate, maxDepreciationPercent);
  const depreciationAmount = (replacementCost * depreciationPercent) / 100;
  const currentAssetValue = replacementCost - depreciationAmount;

  return (
    <div className="space-y-4">
      <InfrastructureSummary
        replacementCost={replacementCost}
        depreciationAmount={depreciationAmount}
        currentAssetValue={currentAssetValue}
      />

      <InfrastructureBreakdown
        totalLength={totalLength}
        averageWidth={averageWidth}
        assetAge={assetAge}
        constructionCostPerMeter={constructionCostPerMeter}
        annualMaintenanceCost={annualMaintenanceCost}
        replacementCost={replacementCost}
        depreciationAmount={depreciationAmount}
        currentAssetValue={currentAssetValue}
        depreciationRate={depreciationRate}
        depreciationPercent={depreciationPercent}
        setConstructionCostPerMeter={setConstructionCostPerMeter}
        setAnnualMaintenanceCost={setAnnualMaintenanceCost}
      />
    </div>
  );
}
