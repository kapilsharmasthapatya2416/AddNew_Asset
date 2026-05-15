"use client";

import React from "react";
import { Input, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { MapPin, Ruler } from "lucide-react";
import { useAssetForm } from "../AssetFormContext";

import { AssetWizardStepProps } from "@/types/asset-wizard.types";

export function AssetLocationDetails({ formData, onChange }: AssetWizardStepProps) {
  const isLand = formData.category === "land";

  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-violet-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-violet-50 pb-3 mb-4">
        <div className="bg-violet-600 p-1.5 rounded-lg">
          <MapPin className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          D) Location & Address Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLand && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 p-3 bg-violet-50/50 rounded-xl border border-violet-100 mb-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 col-span-full mb-1">
              <Ruler className="size-3.5 text-violet-600" />
              <span className="text-[11px] font-black text-violet-800 uppercase tracking-tighter">Land Specifications</span>
            </div>
            <Input
              label="Survey Number"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={onChange}
              placeholder="e.g. 124/A/1"
              required
            />
            <Input
              label="Plot Number"
              name="plotNumber"
              value={formData.plotNumber}
              onChange={onChange}
              placeholder="e.g. 45"
            />
            <Input
              label="Total Land Area (Sq. Ft)"
              name="landArea"
              value={formData.landArea}
              onChange={onChange}
              placeholder="0.00"
              type="number"
              required
            />
          </div>
        )}

        <Input
          label="Full Postal Address"
          name="fullAddress"
          value={formData.fullAddress}
          onChange={onChange}
          placeholder="Detailed street address, building name, etc."
          required
          fullWidth
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <Input
            label="Locality / Area"
            name="locality"
            value={formData.locality}
            onChange={onChange}
            placeholder="e.g. Shivaji Nagar"
          />
          <Input
            label="Landmark"
            name="landmark"
            value={formData.landmark}
            onChange={onChange}
            placeholder="e.g. Opposite Central Bus Stand"
          />
          <Input
            label="Pin Code"
            name="pinCode"
            value={formData.pinCode}
            onChange={onChange}
            placeholder="6-digit code"
            maxLength={6}
          />
          <Input
            label="Latitude"
            name="latitude"
            value={formData.latitude}
            onChange={onChange}
            placeholder="e.g. 19.0760"
          />
          <Input
            label="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={onChange}
            placeholder="e.g. 72.8777"
          />
        </div>
      </CardContent>
    </Card>
  );
}
