"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Input, Select } from "@/components/common";
import { ListPlus } from "lucide-react";
import { HARDCODED_ASSET_DATA } from "../constants";

interface DynamicAttributesProps {
  formData: any;
  onAttributeChange: (name: string, value: any) => void;
}

export function DynamicAttributes({ formData, onAttributeChange }: DynamicAttributesProps) {
  const categoryData = HARDCODED_ASSET_DATA[formData.category];

  // Auto-calculate land area if length and width change
  React.useEffect(() => {
    const length = parseFloat(formData.attributes?.landLength || "0");
    const width = parseFloat(formData.attributes?.landWidth || "0");
    
    if (length > 0 && width > 0) {
      const calculatedArea = (length * width).toFixed(2);
      if (formData.attributes?.landArea !== calculatedArea) {
        onAttributeChange("landArea", calculatedArea);
      }
    }
  }, [formData.attributes?.landLength, formData.attributes?.landWidth, onAttributeChange, formData.attributes?.landArea]);

  if (!categoryData) return null;

  const typeData = categoryData.types[formData.assetType];
  if (!typeData) return null;

  // Helper to render fields
  const renderFields = (fields: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field: any) => (
        <div key={field.name} className="space-y-1.5">
          {field.type === "select" ? (
            <Select
              label={field.label}
              name={field.name}
              value={formData.attributes[field.name] || ""}
              onChange={(e) => onAttributeChange(field.name, e.target.value)}
              options={field.options.map((opt: string) => ({ label: opt, value: opt }))}
              className="h-10 text-xs"
            />
          ) : field.type === "checkbox" ? (
             <div className="flex items-center gap-2 h-10 pt-6">
              <input
                type="checkbox"
                id={field.name}
                checked={formData.attributes[field.name] || false}
                onChange={(e) => onAttributeChange(field.name, e.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={field.name} className="text-xs font-semibold text-slate-700">
                {field.label}
              </label>
            </div>
          ) : (
            <Input
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData.attributes[field.name] || ""}
              onChange={(e) => onAttributeChange(field.name, e.target.value)}
              className="h-10 text-xs"
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // If configuration has sections (New Master Screen Logic)
  if (typeData.sections && typeData.sections.length > 0) {
    return (
      <div className="space-y-6">
        {typeData.sections.map((section: any) => (
          <Card key={section.id} variant="bordered" padding="md" className="shadow-sm border-blue-100 bg-white">
            <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-3 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ListPlus className="size-4 text-white" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {section.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderFields(section.fields)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Fallback to flat fields (Legacy Logic)
  if (!typeData.fields || typeData.fields.length === 0) return null;

  return (
    <Card variant="bordered" padding="md" className="shadow-sm border-blue-100 bg-white">
      <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-3 mb-6">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <ListPlus className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          {typeData.label} Specific Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderFields(typeData.fields)}
      </CardContent>
    </Card>
  );
}
