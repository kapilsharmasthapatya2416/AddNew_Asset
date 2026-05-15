'use client';

import { Card } from '@/components/common';
import { IndianRupee } from 'lucide-react';

interface LandSummaryProps {
  totalLandValue: number;
  developmentCost: number;
  marketValue: number;
}

export default function LandSummary({
  totalLandValue,
  developmentCost,
  marketValue,
}: LandSummaryProps) {
  const cards = [
    {
      title: 'Total Land Value',
      value: totalLandValue,
      subtitle: 'Land Area × Rate',
    },
    {
      title: 'Development Cost',
      value: developmentCost,
      subtitle: 'Infrastructure & Development',
    },
    {
      title: 'Current Market Value',
      value: marketValue,
      subtitle: 'With Market Appreciation',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-gray-600">
              {card.title}
            </div>

            <div className="mt-2 flex items-center gap-1 text-lg font-semibold text-blue-700">
              <IndianRupee className="h-4 w-4" />
              <span>{card.value.toLocaleString()}</span>
            </div>

            <div className="mt-1 text-xs text-blue-500">
              {card.subtitle}
            </div>
          </Card>
        ))}
      </div>

      {/* Highlight Total */}
      <Card className="border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-green-800">
            Total Current Market Value
          </div>

          <div className="flex items-center gap-1 text-green-900 font-semibold">
            <IndianRupee className="h-4 w-4" />
            <span>{marketValue.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}