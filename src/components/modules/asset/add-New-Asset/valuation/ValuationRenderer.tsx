'use client';

import { useState } from 'react';
import LandSummary from './land/LandSummary';
import LandBreakdown from './land/LandBreakdown';
import BuildingSummary from './building/ValuationSummary';
import BuildingBreakdown from './building/ValuationBreakdown';
import { ValuationRendererProps } from '@/types/valuation.types';
import InfrastructureValuation from './Infrastructure/InfrastructureValuation';

export default function ValuationRenderer({
  category,
  valuation,
  details,
}: ValuationRendererProps) {
  const [area] = useState(0);
  const [rate, setRate] = useState(0);
  const [developmentCost, setDevelopmentCost] = useState(0);
  const [appreciation, setAppreciation] = useState(0);

  const totalLandValue = area * rate;
  const totalAssetValue = totalLandValue + developmentCost;
  const marketValue = totalAssetValue * (1 + appreciation / 100);

  switch (category) {
    case 'building':
      return (
        <>
          <BuildingSummary data={valuation} details={details} />
          <BuildingBreakdown data={valuation} />
        </>
      );

    case 'land':
      return (
        <>
          <LandSummary
            totalLandValue={totalLandValue}
            developmentCost={developmentCost}
            marketValue={marketValue}
          />

          <LandBreakdown
            area={area}
            rate={rate}
            developmentCost={developmentCost}
            appreciation={appreciation}
            setRate={setRate}
            setDevelopmentCost={setDevelopmentCost}
            setAppreciation={setAppreciation}
          />
        </>
      );

    case 'infrastructure':
      return <InfrastructureValuation valuation={valuation} details={details} />;

    case 'movable':
      return <div className="text-sm text-gray-600">Movable asset valuation UI coming soon.</div>;

    default:
      return <div className="text-sm text-gray-600">Unsupported asset category.</div>;
  }
}
