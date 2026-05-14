'use client';

import { useState } from 'react';
import { Card } from '@/components/common';
import {
  ValuationDetailsData,
  ValuationDetailSection,
  ValuationResponse,
} from '@/types/valuation.types';
import { IndianRupee } from 'lucide-react';
import ValuationDetailsDrawer from './ValuationDetailsDrawer';

interface ValuationSummaryProps {
  data: ValuationResponse;
  details: ValuationDetailsData;
}

export default function ValuationSummary({ data, details }: ValuationSummaryProps) {
  const { building, furniture, itEquipment, electronics, vehicles, grandTotal } = data;
  const [selectedSection, setSelectedSection] = useState<ValuationDetailSection | null>(null);

  const cards = [
    {
      key: 'building' as const,
      title: 'Building Capital Value (CV)',
      value: building.capitalValue,
      subtitle: 'From Construction Details (C)',
    },
    {
      key: 'furniture' as const,
      title: 'Furniture Items Value',
      value: furniture.totalValue,
      subtitle: 'From Furniture Inventory (A)',
    },
    {
      key: 'itEquipment' as const,
      title: 'IT Equipment Value',
      value: itEquipment.totalValue,
      subtitle: 'From IT Equipment Inventory (B)',
    },
    {
      key: 'electronics' as const,
      title: 'Electronic Fixtures Value',
      value: electronics.totalValue,
      subtitle: 'From Electronic Fixtures Inventory (C)',
    },
    {
      key: 'vehicles' as const,
      title: 'Vehicles Value',
      value: vehicles.totalValue,
      subtitle: 'From Vehicles Inventory (D)',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="group cursor-pointer rounded-xl border border-blue-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl"
            role="button"
            tabIndex={0}
            onClick={() => setSelectedSection(card.key)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedSection(card.key);
              }
            }}
          >
            <div className="text-sm font-medium text-gray-600">{card.title}</div>

            <div className="mt-3 flex items-center gap-1 text-lg font-semibold text-blue-700 transition-colors group-hover:text-blue-800">
              <IndianRupee className="h-4 w-4" />
              <span>{card.value.toLocaleString()}</span>
            </div>

            <div className="mt-2 text-xs text-blue-500">{card.subtitle}</div>
          </Card>
        ))}
      </div>

      <Card className="group overflow-hidden border border-blue-200 bg-linear-to-r from-blue-50 via-white to-blue-50 px-3 py-2 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 transition-colors group-hover:text-blue-900">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <IndianRupee className="h-4 w-4" />
            </span>
            Grand Total Asset Value
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-blue-900 px-3 py-2 font-semibold text-white shadow-lg transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl">
            <IndianRupee className="h-4 w-4" />
            <span className="text-sm">{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <ValuationDetailsDrawer
        open={selectedSection !== null}
        onClose={() => setSelectedSection(null)}
        section={selectedSection}
        details={details}
      />
    </div>
  );
}
