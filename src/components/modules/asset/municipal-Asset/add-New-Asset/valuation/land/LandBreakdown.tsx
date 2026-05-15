'use client';

import LandDetailsSection from './LandDetailsSection';
import DevelopmentSection from './DevelopmentSection';
import { LandBreakdownProps } from '@/types/valuation.types';

export default function LandBreakdown({
  area,
  rate,
  developmentCost,
  appreciation,
  setRate,
  setDevelopmentCost,
  setAppreciation,
}: LandBreakdownProps) {
  const totalLandValue = area * rate;
  const totalAssetValue = totalLandValue + developmentCost;
  const marketValue = totalAssetValue * (1 + appreciation / 100);

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-blue-800">
        Detailed Valuation Breakdown
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LandDetailsSection
          area={area}
          rate={rate}
          setRate={setRate}
          totalLandValue={totalLandValue}
        />

        <DevelopmentSection
          developmentCost={developmentCost}
          appreciation={appreciation}
          setDevelopmentCost={setDevelopmentCost}
          setAppreciation={setAppreciation}
          totalLandValue={totalLandValue}
          totalAssetValue={totalAssetValue}
          marketValue={marketValue}
        />
      </div>
    </div>
  );
}
