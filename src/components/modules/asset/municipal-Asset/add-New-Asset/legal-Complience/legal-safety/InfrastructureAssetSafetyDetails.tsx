"use client";

import React, { useState } from "react";
import { Card, Input, ToggleSwitch, Button } from "@/components/common";
import { ShieldCheck, Upload } from "lucide-react";

type DocField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "date";
};

function SectionHeader({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {badge}
      </span>
      <span>{title}</span>
    </div>
  );
}

function InfrastructureDocCard({
  title,
  enabled,
  onToggle,
  fields,
}: {
  title: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
  fields: DocField[];
}) {
  return (
    <Card
      variant="bordered"
      padding="sm"
      className="border-blue-200 border-2 shadow-sm rounded-xl bg-linear-to-br from-white to-blue-50/50"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <ToggleSwitch checked={enabled} onChange={onToggle} showPopup={false} />
      </div>

      <div className={`mt-3 grid gap-2 ${fields.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {fields.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            type={field.type ?? "text"}
            placeholder={field.placeholder}
            disabled={!enabled}
            className="text-[12px] px-2 border-blue-200 border-2 rounded-xl"
          />
        ))}
      </div>

      <div className="mt-2">
        <Button
          variant="secondary"
          size="xs"
          icon={Upload}
          disabled={!enabled}
          className="w-full rounded-md hover:cursor-pointer"
        >
          Upload
        </Button>
      </div>
    </Card>
  );
}

export default function InfrastructureAssetSafetyDetails(): React.ReactElement {
  const [workCompletionEnabled, setWorkCompletionEnabled] = useState<boolean>(false);
  const [technicalSanctionEnabled, setTechnicalSanctionEnabled] = useState<boolean>(false);
  const [administrativeApprovalEnabled, setAdministrativeApprovalEnabled] = useState<boolean>(false);
  const [defectLiabilityEnabled, setDefectLiabilityEnabled] = useState<boolean>(false);
  const [maintenanceHandoverEnabled, setMaintenanceHandoverEnabled] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-gray-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold">Legal, Safety & Compliance Details</h1>
      </div>

      <Card variant="bordered" padding="sm" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionHeader title="Road Legal & Compliance Details" badge="A" />

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <InfrastructureDocCard
            title="Work Completion Cert"
            enabled={workCompletionEnabled}
            onToggle={setWorkCompletionEnabled}
            fields={[
              { key: "wcNo", label: "Cert No", placeholder: "WCC/2024" },
              { key: "wcDate", label: "Date", type: "date" },
              { key: "wcAuthority", label: "Authority", placeholder: "PWD" },
            ]}
          />

          <InfrastructureDocCard
            title="Technical Sanction (TS)"
            enabled={technicalSanctionEnabled}
            onToggle={setTechnicalSanctionEnabled}
            fields={[
              { key: "tsNo", label: "TS No", placeholder: "TS/2024" },
              { key: "tsDate", label: "Date", type: "date" },
              { key: "tsCost", label: "Cost (Rs.)", placeholder: "50L" },
            ]}
          />

          <InfrastructureDocCard
            title="Administrative Approval"
            enabled={administrativeApprovalEnabled}
            onToggle={setAdministrativeApprovalEnabled}
            fields={[
              { key: "aaNo", label: "AA No", placeholder: "AA/2024" },
              { key: "aaDate", label: "Date", type: "date" },
              { key: "aaAuthority", label: "Authority", placeholder: "Comm." },
            ]}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <InfrastructureDocCard
            title="Defect Liability Period"
            enabled={defectLiabilityEnabled}
            onToggle={setDefectLiabilityEnabled}
            fields={[
              { key: "dlStart", label: "Start Date", type: "date" },
              { key: "dlEnd", label: "End Date", type: "date" },
              { key: "dlContractor", label: "Contractor", placeholder: "Name" },
            ]}
          />

          <InfrastructureDocCard
            title="Maintenance Handover"
            enabled={maintenanceHandoverEnabled}
            onToggle={setMaintenanceHandoverEnabled}
            fields={[
              { key: "mhDate", label: "Date", type: "date" },
              { key: "mhHandedTo", label: "Handed To", placeholder: "Dept/Ward" },
              { key: "mhResponsibility", label: "Responsibility", placeholder: "Ward/PWD" },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}