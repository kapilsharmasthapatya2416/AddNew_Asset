import { Card, Badge } from '@/components/common';
import {
  Building2,
  Sofa,
  Laptop,
  Zap,
  Car,
  IndianRupee,
  Info,
  type LucideIcon,
} from 'lucide-react';
import { ValuationResponse } from '@/types/valuation.types';

type CardColor = 'blue' | 'purple' | 'green' | 'yellow';

interface CustomCardRow {
  label: string;
  value: string;
  auto?: boolean;
}

interface CustomCardProps {
  title: string;
  rows: CustomCardRow[];
  total: number;
  footer: string;
  color: CardColor;
  icon?: LucideIcon;
}

export default function ValuationBreakdown({ data }: { data: ValuationResponse }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">Detailed Valuation Breakdown</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <CustomCard
          title="Building Valuation"
          color="blue"
          icon={Building2}
          rows={[
            {
              label: 'Total Floors Count',
              value: `${data.building.floors} Floors`,
              auto: true,
            },
            {
              label: 'Total Built-up Area',
              value: `${data.building.totalBuiltUpArea} sq.ft`,
              auto: true,
            },
          ]}
          total={data.building.capitalValue}
          footer="Auto-calculated from Construction Details (Section C)"
        />

        <CustomCard
          title="A) Furniture Items"
          color="purple"
          icon={Sofa}
          rows={[
            {
              label: 'Total Furniture Items Count',
              value: `${data.furniture.items} Items`,
            },
            {
              label: 'Total Quantity (Units)',
              value: `${data.furniture.totalQuantity} Units`,
            },
          ]}
          total={data.furniture.totalValue}
          footer="From Furniture Inventory (Part A)"
        />

        {/* 💻 IT */}
        <CustomCard
          title="B) IT Equipment"
          color="blue"
          icon={Laptop}
          rows={[
            {
              label: 'Total IT Equipment Count',
              value: `${data.itEquipment.items} Items`,
            },
            {
              label: 'Total Quantity (Units)',
              value: `${data.itEquipment.totalQuantity} Units`,
            },
          ]}
          total={data.itEquipment.totalValue}
          footer="From IT Equipment Inventory (Part B)"
        />

        <CustomCard
          title="C) Electronic Fixtures"
          color="green"
          icon={Zap}
          rows={[
            {
              label: 'Total Electronic Fixtures Count',
              value: `${data.electronics.items} Items`,
            },
            {
              label: 'Total Quantity (Units)',
              value: `${data.electronics.totalQuantity} Units`,
            },
          ]}
          total={data.electronics.totalValue}
          footer="From Electronic Fixtures Inventory (Part C)"
        />

        <CustomCard
          title="D) Vehicles"
          color="yellow"
          icon={Car}
          rows={[
            {
              label: 'Total Vehicles Count',
              value: `${data.vehicles.items} Vehicles`,
            },
            {
              label: 'Total Quantity (Units)',
              value: `${data.vehicles.totalQuantity} Units`,
            },
          ]}
          total={data.vehicles.totalValue}
          footer="From Vehicles Inventory (Part D)"
        />
      </div>
    </div>
  );
}

function CustomCard({ title, rows, total, footer, color, icon: Icon }: CustomCardProps) {
  const colorMap = {
    blue: {
      header: 'bg-blue-50 text-blue-700 border-blue-200',
      total: 'bg-blue-100 text-blue-800',
    },
    purple: {
      header: 'bg-purple-50 text-purple-700 border-purple-200',
      total: 'bg-purple-100 text-purple-800',
    },
    green: {
      header: 'bg-green-50 text-green-700 border-green-200',
      total: 'bg-green-100 text-green-800',
    },
    yellow: {
      header: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      total: 'bg-yellow-100 text-yellow-800',
    },
  };

  const styles = colorMap[color];

  return (
    <Card className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl">
      {/* Header */}
      <div
        className={`mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${styles.header}`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {title}
      </div>

      {/* Rows */}
      <div className="space-y-2 text-sm">
        {rows.map((row, i: number) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border bg-gray-50 px-3 py-2 transition-colors group-hover:bg-gray-100/80"
          >
            <span className="text-gray-600">{row.label}</span>

            <span className="flex items-center gap-2 font-medium text-gray-800">
              {row.value}
              {row.auto && <Badge className="text-xs">Auto</Badge>}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        className={`mt-4 flex items-center gap-1 rounded-lg px-3 py-3 font-semibold transition-all ${styles.total}`}
      >
        <IndianRupee className="w-4 h-4" />
        {total.toLocaleString()}
      </div>

      {/* Footer */}
      <div className="flex text-xs text-gray-500 mt-2 gap-1">
        <Info className="h-3 w-3 text-blue-600" /> {footer}
      </div>
    </Card>
  );
}
