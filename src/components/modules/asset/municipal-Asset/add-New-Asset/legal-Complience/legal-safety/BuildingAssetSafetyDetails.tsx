"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  Input,
  Select,
  ToggleSwitch,
} from "@/components/common";
import { ShieldCheck } from "lucide-react";

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const conditionOptions = [
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Poor", value: "poor" },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        A
      </span>
      <span>{title}</span>
    </div>
  );
}

function SectionHeaderB({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        B
      </span>
      <span>{title}</span>
    </div>
  );
}

function SectionHeaderC({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        C
      </span>
      <span>{title}</span>
    </div>
  );
}

function DocumentCard({
  title,
  enabled,
  onToggle,
  numberLabel,
  numberPlaceholder,
  dateLabel,
}: {
  title: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
  numberLabel: string;
  numberPlaceholder?: string;
  dateLabel: string;
}) {
  return (
    <Card
      variant="bordered"
      padding="sm"
      className="border-blue-200 border-2 shadow-sm rounded-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-semibold text-blue-900">{title}</div>
        <ToggleSwitch checked={enabled} onChange={onToggle} showPopup={false} />
      </div>
      <div className="mt-3 space-y-3">
        <Input
          label={numberLabel}
          placeholder={numberPlaceholder}
          disabled={!enabled}
          className="text-[12px] px-2 border-blue-200 border-2 rounded-xl"
        />
        <Input label={dateLabel} type="date" disabled={!enabled} className="text-[12px] px-2 border-blue-200 border-2 rounded-xl" />
      </div>
    </Card>
  );
}

export default function BuildingAssetSafetyDetails(): React.ReactElement {
  const [approvedPlan, setApprovedPlan] = useState<boolean>(false);
  const [completionCert, setCompletionCert] = useState<boolean>(false);
  const [occupancyCert, setOccupancyCert] = useState<boolean>(false);

  const [emergencyExit, setEmergencyExit] = useState<boolean>(false);
  const [structuralRisk, setStructuralRisk] = useState<boolean>(false);
  const [fireSafety, setFireSafety] = useState<boolean>(false);
  const [liftAvailable, setLiftAvailable] = useState<boolean>(false);

  const [waterConnection, setWaterConnection] = useState<boolean>(false);
  const [solarInstalled, setSolarInstalled] = useState<boolean>(false);
  const [rainwaterSystem, setRainwaterSystem] = useState<boolean>(false);
  const [separateMeter, setSeparateMeter] = useState<boolean>(false);

  const [buildingCondition, setBuildingCondition] = useState("good");

  const [fireExtinguisher, setFireExtinguisher] = useState<string>("");
  const [cctvCoverage, setCctvCoverage] = useState<string>("");
  const [emergencyAlarm, setEmergencyAlarm] = useState<string>("");
  const [visitorAccess, setVisitorAccess] = useState<string>("");
  const [biometricAccess, setBiometricAccess] = useState<string>("");

  const conditionOptionsMemo = useMemo(() => conditionOptions, []);
  const yesNoOptionsMemo = useMemo(() => yesNoOptions, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-gray-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold">Legal, Safety & Compliance Details</h1>
      </div>

      {/* A) Building Legal Details */}
      <Card variant="bordered" padding="sm" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionHeader title="Building Legal Details" />
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <DocumentCard
            title="Approved Building Plan"
            enabled={approvedPlan}
            onToggle={setApprovedPlan}
            numberLabel="No"
            numberPlaceholder="ABP/2020/1234"
            dateLabel="Date"
          />

          <DocumentCard
            title="Completion Certificate"
            enabled={completionCert}
            onToggle={setCompletionCert}
            numberLabel="No"
            numberPlaceholder="CC/2020/1234"
            dateLabel="Date"
          />

          <DocumentCard
            title="Occupancy Certificate"
            enabled={occupancyCert}
            onToggle={setOccupancyCert}
            numberLabel="No"
            numberPlaceholder="OC/2020/1234"
            dateLabel="Date"
          />

          <Card variant="default" padding="sm" className="border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                Emergency Exit Available?
              </span>
              <ToggleSwitch checked={emergencyExit} onChange={setEmergencyExit} showPopup={false} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                Structural Risk Identified? *
              </span>
              <ToggleSwitch checked={structuralRisk} onChange={setStructuralRisk} showPopup={false} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                Fire Safety Available?
              </span>
              <ToggleSwitch checked={fireSafety} onChange={setFireSafety} showPopup={false} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                Lift Available?
              </span>
              <ToggleSwitch checked={liftAvailable} onChange={setLiftAvailable} showPopup={false} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Select
                label="Building Condition *"
                options={conditionOptionsMemo}
                value={buildingCondition}
                onChange={setBuildingCondition}
              />
              <Input
                label="Legal Remarks"
                placeholder="Any legal observation"
                className="bg-white"
              />
            </div>
          </Card>
        </div>
      </Card>

      {/* B) Social Details & Water Connection Details */}
      <Card variant="bordered" padding="md" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionHeaderB title="Social Details & Water Connection Details" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <DocumentCard
            title="Water Connection Available"
            enabled={waterConnection}
            onToggle={setWaterConnection}
            numberLabel="Water Connection / Meter Number"
            numberPlaceholder="WM-2024-12345"
            dateLabel="Date"
          />

          <DocumentCard
            title="Solar Panel System Installed"
            enabled={solarInstalled}
            onToggle={setSolarInstalled}
            numberLabel="System Capacity / Number"
            numberPlaceholder="e.g., 5 kW or 10 panels"
            dateLabel="Date"
          />

          <Card variant="bordered" padding="md" className="border-blue-200 border-2 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-900">Rainwater Harvesting System</span>
              <ToggleSwitch checked={rainwaterSystem} onChange={setRainwaterSystem} showPopup={false} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-900">Separate Meter Available (Floor-wise)</span>
              <ToggleSwitch checked={separateMeter} onChange={setSeparateMeter} showPopup={false} />
            </div>
          </Card>
        </div>
      </Card>

      {/* C) Safety Features */}
      <Card variant="bordered" padding="md" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionHeaderC title="Safety Features" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Select
            selectSize="sm"
            label="Fire Extinguisher Available?"
            options={yesNoOptionsMemo}
            value={fireExtinguisher}
            onChange={setFireExtinguisher}
          />
          <Select
            selectSize="sm"
            label="CCTV Coverage?"
            options={yesNoOptionsMemo}
            value={cctvCoverage}
            onChange={setCctvCoverage}
          />
          <Select
            selectSize="sm"
            label="Emergency Alarm System?"
            options={yesNoOptionsMemo}
            value={emergencyAlarm}
            onChange={setEmergencyAlarm}
          />
          <Select
            selectSize="sm"
            label="Visitor Access Control?"
            options={yesNoOptionsMemo}
            value={visitorAccess}
            onChange={setVisitorAccess}
          />
          <Select
            selectSize="sm"
            label="Biometric / Access Control?"
            options={yesNoOptionsMemo}
            value={biometricAccess}
            onChange={setBiometricAccess}
          />
        </div>
      </Card>
    </div>
  );
}