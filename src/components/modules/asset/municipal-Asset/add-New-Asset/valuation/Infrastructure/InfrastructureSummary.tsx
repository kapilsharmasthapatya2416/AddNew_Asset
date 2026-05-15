'use client';

import { Card } from '@/components/common';
import { IndianRupee } from 'lucide-react';

interface InfrastructureSummaryProps {
  replacementCost: number;
  depreciationAmount: number;
  currentAssetValue: number;
}

export default function InfrastructureSummary({
  replacementCost,
  depreciationAmount,
  currentAssetValue,
}: InfrastructureSummaryProps) {
  const cards = [
    {
      title: 'Total Replacement Cost',
      value: replacementCost,
      subtitle: 'New Construction Cost',
      border: 'border-blue-200',
      bg: 'bg-blue-50/40',
      text: 'text-blue-700',
    },
    {
      title: 'Depreciation',
      value: depreciationAmount,
      subtitle: 'Age-based',
      border: 'border-red-200',
      bg: 'bg-red-50/40',
      text: 'text-red-700',
    },
    {
      title: 'Current Asset Value',
      value: currentAssetValue,
      subtitle: 'Present Market Value',
      border: 'border-green-200',
      bg: 'bg-green-50/40',
      text: 'text-green-700',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`rounded-xl border p-4 shadow-sm ${card.border} ${card.bg}`}
          >
            <div className="text-sm font-medium text-gray-700">{card.title}</div>
            <div className={`mt-2 flex items-center gap-1 text-lg font-semibold ${card.text}`}>
              <IndianRupee className="h-4 w-4" />
              <span>{card.value.toLocaleString()}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">{card.subtitle}</div>
          </Card>
        ))}
      </div>

      <Card className="border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-green-800">Total Current Asset Value</div>
          <div className="flex items-center gap-1 text-lg font-semibold text-green-900">
            <IndianRupee className="h-4 w-4" />
            <span>{currentAssetValue.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}