'use client';

import InfrastructureDetailsSection from './InfrastructureDetailsSection';
import InfrastructureDepreciationSection from './InfrastructureDepreciationSection';

interface InfrastructureBreakdownProps {
  totalLength: number;
  averageWidth: number;
  assetAge: number;
  constructionCostPerMeter: number;
  annualMaintenanceCost: number;
  replacementCost: number;
  depreciationAmount: number;
  currentAssetValue: number;
  depreciationRate: number;
  depreciationPercent: number;
  setConstructionCostPerMeter: (value: number) => void;
  setAnnualMaintenanceCost: (value: number) => void;
}

export default function InfrastructureBreakdown(props: InfrastructureBreakdownProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-blue-800">
        Detailed Valuation Breakdown
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfrastructureDetailsSection
          totalLength={props.totalLength}
          averageWidth={props.averageWidth}
          assetAge={props.assetAge}
          constructionCostPerMeter={props.constructionCostPerMeter}
          replacementCost={props.replacementCost}
          setConstructionCostPerMeter={props.setConstructionCostPerMeter}
        />

        <InfrastructureDepreciationSection
          assetAge={props.assetAge}
          depreciationRate={props.depreciationRate}
          depreciationPercent={props.depreciationPercent}
          depreciationAmount={props.depreciationAmount}
          replacementCost={props.replacementCost}
          currentAssetValue={props.currentAssetValue}
          annualMaintenanceCost={props.annualMaintenanceCost}
          setAnnualMaintenanceCost={props.setAnnualMaintenanceCost}
        />
      </div>
    </div>
  );
}
