'use client';

import { Card, Input } from '@/components/common';

interface InfrastructureDetailsSectionProps {
  totalLength: number;
  averageWidth: number;
  assetAge: number;
  constructionCostPerMeter: number;
  replacementCost: number;
  setConstructionCostPerMeter: (value: number) => void;
}

export default function InfrastructureDetailsSection({
  totalLength,
  averageWidth,
  assetAge,
  constructionCostPerMeter,
  replacementCost,
  setConstructionCostPerMeter,
}: InfrastructureDetailsSectionProps) {
  return (
    <Card className="border border-blue-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-lg font-semibold text-blue-800">
        A) Asset Metrics & Construction Cost
      </div>

      <div className="mb-3 rounded-lg border p-3">
        <div className="text-xs text-gray-500">Total Length</div>
        <div className="font-semibold text-blue-700">
          {totalLength ? totalLength : 'Not Available'}
        </div>
      </div>

      <div className="mb-3 rounded-lg border p-3">
        <div className="text-xs text-gray-500">Average Width</div>
        <div className="font-semibold text-blue-700">
          {averageWidth ? averageWidth : 'Not Available'}
        </div>
      </div>

      <div className="mb-3 rounded-lg border p-3">
        <div className="text-xs text-gray-500">Asset Age</div>
        <div className="font-semibold text-blue-700">{assetAge} years</div>
      </div>

      <Input
        label="Construction Cost per Meter (₹/m)"
        type="number"
        value={constructionCostPerMeter}
        onChange={(e) => setConstructionCostPerMeter(Number(e.target.value) || 0)}
      />

      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="text-sm text-green-700">Total Replacement Cost</div>
        <div className="text-lg font-semibold text-green-900">
          ₹ {replacementCost.toLocaleString()}
        </div>
        <div className="text-xs text-green-600">Auto-calculated from metrics</div>
      </div>
    </Card>
  );
}