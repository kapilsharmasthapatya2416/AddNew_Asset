"use client";

import React from "react";
import { Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { ShieldCheck } from "lucide-react";

import { AssetWizardStepProps } from "@/types/asset-wizard.types";

export function OwnershipDetails({ formData, onChange }: AssetWizardStepProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-blue-100">
      <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-3 mb-4">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <ShieldCheck className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Ownership & Acquisition Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Select
          label="Ownership Type"
          name="ownershipType"
          value={formData.ownershipType}
          onChange={onChange}
          required
          options={[
            { label: "Municipal Owned", value: "municipal" },
            { label: "State Government", value: "state" },
            { label: "Central Government", value: "central" },
            { label: "Private (Rented)", value: "private_rented" },
            { label: "Leased", value: "leased" },
          ]}
        />
        <Select
          label="Acquisition Method"
          name="acquisitionMethod"
          value={formData.acquisitionMethod}
          onChange={onChange}
          options={[
            { label: "Purchase", value: "purchase" },
            { label: "Land Acquisition Act", value: "acquisition_act" },
            { label: "Donation / Gift", value: "donation" },
            { label: "Transfer from Dept", value: "transfer" },
            { label: "Reservation in DP", value: "reservation" },
          ]}
        />
        <Input
          label="Date of Possession"
          name="possessionDate"
          value={formData.possessionDate}
          onChange={onChange}
          type="date"
          required
        />
        <Input
          label="Agreement / Order No."
          name="agreementNumber"
          value={formData.agreementNumber}
          onChange={onChange}
          placeholder="e.g. MC/ACQ/2023/123"
        />
        <Input
          label="Agreement Date"
          name="agreementDate"
          value={formData.agreementDate}
          onChange={onChange}
          type="date"
        />
        <Input
          label="Lease / Rent Period (Yrs)"
          name="leasePeriod"
          value={formData.leasePeriod}
          onChange={onChange}
          placeholder="e.g. 99"
          type="number"
        />
      </CardContent>
    </Card>
  );
}
