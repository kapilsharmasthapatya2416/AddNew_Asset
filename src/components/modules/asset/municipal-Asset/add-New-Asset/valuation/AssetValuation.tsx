"use client";

import React from "react";
import { Input, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { BadgeDollarSign } from "lucide-react";

interface AssetValuationProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function AssetValuation({ formData, onChange }: AssetValuationProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-emerald-100">
      <CardHeader className="flex items-center gap-2 border-b border-emerald-50 pb-3 mb-4">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <BadgeDollarSign className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Asset Valuation Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label="Land Value (₹)"
          name="landValue"
          value={formData.landValue}
          onChange={onChange}
          placeholder="e.g. 50,00,000"
          type="number"
          required
        />
        <Input
          label="Building / Structural Value (₹)"
          name="buildingValue"
          value={formData.buildingValue}
          onChange={onChange}
          placeholder="e.g. 25,00,000"
          type="number"
        />
        <Input
          label="Total Asset Value (₹)"
          name="totalValue"
          value={formData.totalValue}
          onChange={onChange}
          placeholder="Sum of Land + Building"
          type="number"
          readOnly
          className="bg-slate-50 font-black text-emerald-700"
        />
        <Input
          label="Valuation Date"
          name="valuationDate"
          value={formData.valuationDate}
          onChange={onChange}
          type="date"
          required
        />
        <Input
          label="Name of Valuer / Agency"
          name="valuerName"
          value={formData.valuerName}
          onChange={onChange}
          placeholder="e.g. PWD Valuation Cell"
        />
        <Input
          label="Valuation Report No."
          name="valuationReportNo"
          value={formData.valuationReportNo}
          onChange={onChange}
          placeholder="e.g. VAL/2024/005"
        />
      </CardContent>
    </Card>
  );
}
