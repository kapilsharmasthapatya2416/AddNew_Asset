"use client";

import React from "react";
import { Input, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { UserCheck } from "lucide-react";

import { AssetWizardStepProps } from "@/types/asset-wizard.types";

export function AssetContact({ formData, onChange }: AssetWizardStepProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-amber-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-amber-50 pb-3 mb-4">
        <div className="bg-amber-600 p-1.5 rounded-lg">
          <UserCheck className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          C) In-Charge / Contact Person Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Input
          label="Name of In-Charge"
          name="inChargeName"
          value={formData.inChargeName}
          onChange={onChange}
          placeholder="e.g. Mr. Rajesh Sharma"
          required
        />
        <Input
          label="Designation"
          name="inChargeDesignation"
          value={formData.inChargeDesignation}
          onChange={onChange}
          placeholder="e.g. Executive Engineer"
          required
        />
        <Input
          label="Mobile Number"
          name="inChargeMobile"
          value={formData.inChargeMobile}
          onChange={onChange}
          placeholder="10-digit mobile number"
          required
          type="tel"
          maxLength={10}
        />
        <Input
          label="Email Address"
          name="inChargeEmail"
          value={formData.inChargeEmail}
          onChange={onChange}
          placeholder="official@municipality.gov.in"
          type="email"
        />
        <Input
          label="Office Extension"
          name="officeExtension"
          value={formData.officeExtension}
          onChange={onChange}
          placeholder="e.g. 104"
        />
      </CardContent>
    </Card>
  );
}
