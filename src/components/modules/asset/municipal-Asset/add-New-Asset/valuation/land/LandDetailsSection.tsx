'use client';

import { Card, Input } from '@/components/common';
import { LandDetailsSectionProps } from '@/types/valuation.types';

export default function LandDetailsSection({
  area,
  rate,
  setRate,
  totalLandValue,
}: LandDetailsSectionProps) {
  return (
    <Card className="p-4 border border-blue-200">
      <div className="text-lg font-semibold text-blue-800">
        A) Land Details & Base Valuation
      </div>

      <div className="mb-3 rounded-lg border p-3">
        <div className="text-xs text-gray-500">Total Land Area</div>
        <div className="font-semibold text-blue-700">{area || 'Not Available'}</div>
      </div>

      <div className="mb-3 rounded-lg border p-3">
        <div className="text-xs text-gray-500">Asset Age</div>
        <div className="font-semibold text-blue-700">16 years</div>
      </div>

      <Input
        label="Land Rate per sq.m (Rs.)"
        type="number"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value) || 0)}
      />

      <div className="mt-1 text-xs text-gray-500">Current market rate per square meter</div>

      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="text-sm text-green-700">Total Land Value</div>
        <div className="text-lg font-semibold text-green-900">Rs. {totalLandValue.toLocaleString()}</div>
        <div className="text-xs text-green-600">Auto-calculated: Area x Rate</div>
      </div>
    </Card>
  );
}
