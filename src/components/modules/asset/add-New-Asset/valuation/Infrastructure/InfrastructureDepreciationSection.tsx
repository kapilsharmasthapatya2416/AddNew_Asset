'use client';

import { Card, Input } from '@/components/common';

interface InfrastructureDepreciationSectionProps {
  assetAge: number;
  depreciationRate: number;
  depreciationPercent: number;
  depreciationAmount: number;
  replacementCost: number;
  currentAssetValue: number;
  annualMaintenanceCost: number;
  setAnnualMaintenanceCost: (value: number) => void;
}

export default function InfrastructureDepreciationSection({
  assetAge,
  depreciationRate,
  depreciationAmount,
  replacementCost,
  currentAssetValue,
  annualMaintenanceCost,
  setAnnualMaintenanceCost,
}: InfrastructureDepreciationSectionProps) {
  return (
    <Card className="border border-blue-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-lg font-semibold text-blue-800">
        B) Depreciation & Current Value
      </div>

      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-600">Depreciation (Age-based)</div>
          <div className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
            {assetAge} yrs @ {depreciationRate}% p.a.
          </div>
        </div>

        <div className="mt-2 text-lg font-semibold text-red-700">
          ₹ {depreciationAmount.toLocaleString()}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Max 50% depreciation applied
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <div className="mb-2 font-medium">Calculation Formula:</div>
        <div>• Replacement Cost: ₹ {replacementCost.toLocaleString()}</div>
        <div>• Less Depreciation: ₹ {depreciationAmount.toLocaleString()}</div>
        <div className="mt-2 border-t pt-2 font-semibold text-green-700">
          • Current Value: ₹ {currentAssetValue.toLocaleString()}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-4">
        <div className="text-sm font-medium text-green-700">Current Asset Value</div>
        <div className="mt-1 text-2xl font-bold text-green-900">
          ₹ {currentAssetValue.toLocaleString()}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Present Market Value after depreciation
        </div>
      </div>

      <Input
        label="Annual Maintenance Cost (₹)"
        type="number"
        value={annualMaintenanceCost}
        onChange={(e) => setAnnualMaintenanceCost(Number(e.target.value) || 0)}
      />

      <div className="mt-1 text-xs text-slate-500">
        Typical: 2-5% of current value
      </div>
    </Card>
  );
}
