"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  Input,
  Select,
  ToggleSwitch,
  Button,
} from "@/components/common";
import { ShieldCheck, Upload } from "lucide-react";

const rightOfWayOptions = [
  { label: "Available", value: "available" },
  { label: "Not Available", value: "not_available" },
  { label: "Under Review", value: "under_review" },
];

function SectionTitle({
  title,
  badge,
}: {
  title: string;
  badge: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {badge}
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
      className="border-blue-200 border-2 shadow-sm rounded-xl bg-linear-to-br from-white to-blue-50/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <ToggleSwitch checked={enabled} onChange={onToggle} showPopup={false} />
      </div>
      <div className="mt-3 space-y-3">
        <Input
          label={numberLabel}
          placeholder={numberPlaceholder}
          disabled={!enabled}
          className="text-[12px] px-2 border-blue-200 border-2 rounded-xl"
        />
        <Input
          label={dateLabel}
          type="date"
          disabled={!enabled}
          className="text-[12px] px-2 border-blue-200 border-2 rounded-xl"
        />
      </div>
    </Card>
  );
}

function ToggleOnlyCard({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <Card
      variant="bordered"
      padding="sm"
      className="border-blue-200 border-2 shadow-sm rounded-xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        <ToggleSwitch checked={enabled} onChange={onToggle} showPopup={false} />
      </div>
    </Card>
  );
}

function UploadCard({
  title,
  enabled,
  onToggle,
}: {
  title: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <Card
      variant="bordered"
      padding="sm"
      className="border-blue-200 border-2 shadow-sm rounded-xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-900">{title}</span>
        <ToggleSwitch checked={enabled} onChange={onToggle} showPopup={false} />
      </div>
      <div className="mt-2 flex items-center">
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

export default function LandAssetSafetyDetails(): React.ReactElement {
  const [titleDeed, setTitleDeed] = useState<boolean>(false);
  const [possessionCert, setPossessionCert] = useState<boolean>(false);
  const [naOrder, setNaOrder] = useState<boolean>(false);

  const [encroachment, setEncroachment] = useState<boolean>(false);
  const [litigation, setLitigation] = useState<boolean>(false);

  const [extract712, setExtract712] = useState<boolean>(false);
  const [propertyCard, setPropertyCard] = useState<boolean>(false);
  const [landAcquisition, setLandAcquisition] = useState<boolean>(false);
  const [gazetteNotification, setGazetteNotification] = useState<boolean>(false);
  const [dpReservation, setDpReservation] = useState<boolean>(false);

  const [rightOfWay, setRightOfWay] = useState("available");

  const [boundaryWall, setBoundaryWall] = useState<boolean>(false);
  const [roadAccess, setRoadAccess] = useState<boolean>(false);
  const [waterLine, setWaterLine] = useState<boolean>(false);
  const [electricityConnection, setElectricityConnection] = useState<boolean>(false);
  const [drainage, setDrainage] = useState<boolean>(false);

  const rightOfWayOptionsMemo = useMemo(() => rightOfWayOptions, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-gray-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold">Legal, Safety & Compliance Details</h1>
      </div>

      <Card variant="bordered" padding="sm" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionTitle title="Land Legal Details" badge="A" />

        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <DocumentCard
            title="Title Deed Available"
            enabled={titleDeed}
            onToggle={setTitleDeed}
            numberLabel="No"
            numberPlaceholder="TD/2020/1234"
            dateLabel="Date"
          />

          <DocumentCard
            title="Possession Certificate"
            enabled={possessionCert}
            onToggle={setPossessionCert}
            numberLabel="No"
            numberPlaceholder="PC/2020/1234"
            dateLabel="Date"
          />

          <DocumentCard
            title="NA Order"
            enabled={naOrder}
            onToggle={setNaOrder}
            numberLabel="No"
            numberPlaceholder="NA/2020/1234"
            dateLabel="Date"
          />

          <Card variant="bordered" padding="sm" className="border-blue-200 border-2 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Encroachment Identified?</span>
              <ToggleSwitch checked={encroachment} onChange={setEncroachment} showPopup={false} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Litigation / Court Case?</span>
              <ToggleSwitch checked={litigation} onChange={setLitigation} showPopup={false} />
            </div>
          </Card>
        </div>

        <div className="mt-4">
          <Input
            label="Legal Remarks"
            placeholder="Any legal observation"
            className="bg-white"
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <UploadCard
            title="7/12 Extract"
            enabled={extract712}
            onToggle={setExtract712}
          />
          <UploadCard
            title="Property Card"
            enabled={propertyCard}
            onToggle={setPropertyCard}
          />
          <UploadCard
            title="Land Acquisition"
            enabled={landAcquisition}
            onToggle={setLandAcquisition}
          />
          <UploadCard
            title="Gazette Notification"
            enabled={gazetteNotification}
            onToggle={setGazetteNotification}
          />
          <UploadCard
            title="DP Reservation"
            enabled={dpReservation}
            onToggle={setDpReservation}
          />
          <Card variant="bordered" padding="sm" className="border-blue-200 border-2 shadow-sm rounded-xl">
            <Select
              selectSize="sm"
              label="Right of Way"
              options={rightOfWayOptionsMemo}
              value={rightOfWay}
              onChange={setRightOfWay}
            />
          </Card>
        </div>
      </Card>

      <Card variant="bordered" padding="sm" className="border-blue-200 rounded-2xl shadow-sm">
        <SectionTitle title="Utilities & Development Status" badge="B" />

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <ToggleOnlyCard label="Boundary Wall Available?" enabled={boundaryWall} onToggle={setBoundaryWall} />
          <ToggleOnlyCard label="Road Access Available?" enabled={roadAccess} onToggle={setRoadAccess} />
          <ToggleOnlyCard label="Water Line Available?" enabled={waterLine} onToggle={setWaterLine} />
          <ToggleOnlyCard
            label="Electricity Connection?"
            enabled={electricityConnection}
            onToggle={setElectricityConnection}
          />
          <ToggleOnlyCard label="Drainage Available?" enabled={drainage} onToggle={setDrainage} />
        </div>
      </Card>
    </div>
  );
}