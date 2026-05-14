'use client';

import { Card, Input } from '@/components/common';
import { DevelopmentSectionProps } from '@/types/valuation.types';

export default function DevelopmentSection({
  developmentCost,
  appreciation,
  setDevelopmentCost,
  setAppreciation,
  totalLandValue,
  totalAssetValue,
  marketValue,
}: DevelopmentSectionProps) {
  return (
    <Card className="border border-blue-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800">B) Development & Market Value</h3>
      </div>

      <Input
        label="Development Cost (Rs.)"
        type="number"
        value={developmentCost}
        onChange={(e) => setDevelopmentCost(Number(e.target.value) || 0)}
      />

      <div className="mb-4 mt-1 text-xs text-slate-500">
        Infrastructure, leveling, boundary wall, etc.
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-xs font-medium text-slate-500">Total Asset Value</div>
        <div className="mt-1 text-lg font-semibold text-slate-800">
          Rs. {totalAssetValue.toLocaleString()}
        </div>
        <div className="mt-1 text-xs text-slate-500">Land Value + Development Cost</div>
      </div>

      <Input
        label="Market Appreciation (%)"
        type="number"
        value={appreciation}
        onChange={(e) => setAppreciation(Number(e.target.value) || 0)}
      />

      <div className="mb-4 mt-1 text-xs text-slate-500">
        Typical: 5-15% based on location and market
      </div>

      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700">
        <div className="flex items-center justify-between">
          <span>Land Value</span>
          <span className="font-semibold">Rs. {totalLandValue.toLocaleString()}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Plus Development Cost</span>
          <span className="font-semibold">Rs. {developmentCost.toLocaleString()}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Plus Appreciation</span>
          <span className="font-semibold">{appreciation}%</span>
        </div>
        <div className="mt-2 border-t border-blue-200 pt-2 text-sm font-semibold text-green-700">
          Market Value: Rs. {marketValue.toLocaleString()}
        </div>
      </div>

      <div className="rounded-xl border border-green-300 bg-linear-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
        <div className="text-sm font-medium text-green-700">Current Market Value</div>
        <div className="mt-1 text-2xl font-bold text-green-900">
          Rs. {marketValue.toLocaleString()}
        </div>
      </div>
    </Card>
  );
}
