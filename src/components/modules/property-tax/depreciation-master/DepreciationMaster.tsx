"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import type { JSX } from "react";

import TableHeader from "@/components/common/TableHeader";
import {
  AddButton,
  DeleteButton,
  EditButton,
  Input,
  useConfirm,
} from "@/components/common";
import { PageContainer } from "@/components/common/PageContainer";
import { CardPagination } from "@/components/common/Card";
import {
  MatrixGrid,
  type MatrixColumn,
  type MatrixRow,
} from "@/components/common/MatrixGrid";

import {
  addRangeAction,
  syncDepreciationRatesAction,
  deleteRangeAction,
} from "@/app/[locale]/property-tax/depreciation-master/actions";

import type { ConstructionType, DepreciationRow } from "@/types/depreciation.types";

/* ================= TYPES & UTILS ================= */

type RangeRow = {
  id: string; 
  min: number;
  max: number;
  label: string;
};

type DepreciationMasterProps = {
  // Paginated data props (SSR)
  data: DepreciationRow[];
  constructionTypes: ConstructionType[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  locale?: string;
};

function makeRangeId(min: number, max: number): string {
  return `${min}-${max}`;
}

/* ================= COMPONENT ================= */

export default function DepreciationMaster({
  data,
  constructionTypes: initialConstructionTypes,
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  locale: localeProp,
}: Readonly<DepreciationMasterProps>): JSX.Element {
  const t = useTranslations("depreciation.depreciationMaster");
  const { confirm } = useConfirm();
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeProp ?? "en";

  /* ----------------------------- State ----------------------------- */

  const [saving, setSaving] = useState(false);
  
  // Global Dirty Tracking: { [depreciationId]: newValue }
  const [pendingChanges, setPendingChanges] = useState<Record<number, number>>({});
  
  const [constructionTypes, setConstructionTypes] = useState<ConstructionType[]>(initialConstructionTypes);
  const [dbRows, setDbRows] = useState<DepreciationRow[]>(data);
  const [ranges, setRanges] = useState<RangeRow[]>([]);
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [minError, setMinError] = useState<string | null>(null);
  const [maxError, setMaxError] = useState<string | null>(null);

  const [ratesByRange, setRatesByRange] = useState<Record<string, Record<number, number>>>({});

  /* ================= URL NAVIGATION HELPERS ================= */

  const buildUrl = useCallback(
    (page: number, size: number) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(size));
      return `${pathname}?${params.toString()}`;
    },
    [pathname]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(buildUrl(page, pageSize));
    },
    [router, buildUrl, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      router.push(buildUrl(1, size));
    },
    [router, buildUrl]
  );

  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  /* ================= BUILD UI LOGIC ================= */

  const buildUiFromDb = useCallback(
    (ct: ConstructionType[], currentDbRows: DepreciationRow[]) => {
      const rangeMap = new Map<string, RangeRow>();
      const rateMap: Record<string, Record<number, number>> = {};

      currentDbRows.forEach((row) => {
        const id = makeRangeId(row.minYear, row.maxYear);

        if (!rangeMap.has(id)) {
          rangeMap.set(id, {
            id,
            min: row.minYear,
            max: row.maxYear,
            label: `${row.minYear}-${row.maxYear} Years`,
          });
        }

        if (!rateMap[id]) rateMap[id] = {};
        rateMap[id][row.constructionTypeId] = row.rate ?? 0;
      });

      // Ensure default 0 for missing types
      rangeMap.forEach((r) => {
        if (!rateMap[r.id]) rateMap[r.id] = {};
        ct.forEach((c) => {
          rateMap[r.id][c.constructionId] ??= 0;
        });
      });

      const sortedRanges = Array.from(rangeMap.values()).sort((a, b) => a.min - b.min);

      console.log('[buildUiFromDb] Built ranges:', sortedRanges.map(r => `${r.min}-${r.max}`));

      setRanges(sortedRanges);
      setRatesByRange(rateMap);
      setDbRows(currentDbRows); // Important for ID mapping during cell changes

      setSelectedRangeId((prev) =>
        prev && sortedRanges.some((r) => r.id === prev) ? prev : sortedRanges[0]?.id ?? null
      );
    },
    []
  );

  // Sync state if server props change
  useEffect(() => {
    console.log('[DepreciationMaster] Received data:', data.length, 'rows');
    console.log('[DepreciationMaster] Page info - Page:', pageNumber, 'PageSize:', pageSize, 'Total:', totalCount, 'TotalPages:', totalPages);
    setConstructionTypes(initialConstructionTypes);
    buildUiFromDb(initialConstructionTypes, data);
    setPendingChanges({});
  }, [initialConstructionTypes, data, buildUiFromDb, pageNumber, pageSize, totalCount, totalPages]);

  /* ================= DATA RELOAD ================= */

  const reloadData = useCallback(async () => {
    setSaving(true);
    try {
      // Refresh the page to get fresh data from server
      refreshPage();
      setPendingChanges({});
    } catch (err: any) {
      toast.error(err.message || t("errors.load"));
    } finally {
      setSaving(false);
    }
  }, [t, refreshPage]);

  /* ================= HANDLERS ================= */

  const handleCellChange = (rowId: string, colId: string, value: number) => {
    // 1. Visual Update
    setRatesByRange((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [Number(colId)]: value },
    }));

    // 2. Global DB Sync Tracking
    const range = ranges.find(r => r.id === rowId);
    if (!range) return;

    // Search the actual DB records to find the unique depreciationId
    const targetRecord = dbRows.find(r => 
      r.constructionTypeId === Number(colId) && 
      r.minYear === range.min && 
      r.maxYear === range.max
    );

    if (targetRecord?.depreciationId) {
      setPendingChanges(prev => ({
        ...prev,
        [targetRecord.depreciationId]: value
      }));
    }
  };

  const handleUpdateRates = async () => {
    const changeCount = Object.keys(pendingChanges).length;
    if (changeCount === 0) {
      toast.info("No changes to update.");
      return;
    }

    setSaving(true);
    const tid = toast.loading(`Updating ${changeCount} records...`);
    try {
      // Sends all changes across the entire grid to the server
      const res = await syncDepreciationRatesAction(locale, pendingChanges);
      if (!res.success) throw new Error(res.error);

      toast.success(t("success.updated"), { id: tid });
      await reloadData(); 
    } catch (err: any) {
      toast.error(err.message || t("errors.update"), { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const validateMinMax = (min: string, max: string): boolean => {
    let valid = true;
    setMinError(null);
    setMaxError(null);
    // Required
    if (!min) {
      setMinError(t("errors.minMax"));
      valid = false;
    }
    if (!max) {
      setMaxError(t("errors.minMax"));
      valid = false;
    }
    // Must be number
    if (min && !/^\d+$/.test(min)) {
      setMinError(t("errors.mustBeNumber") || "Must be a valid number");
      valid = false;
    }
    if (max && !/^\d+$/.test(max)) {
      setMaxError(t("errors.mustBeNumber") || "Must be a valid number");
      valid = false;
    }
    // No negative
    if (min && Number(min) < 0) {
      setMinError("Cannot be negative");
      valid = false;
    }
    if (max && Number(max) < 0) {
      setMaxError("Cannot be negative");
      valid = false;
    }
    // Max 100
    if (min && Number(min) > 100) {
      setMinError("Must be 100 or less");
      valid = false;
    }
    if (max && Number(max) > 100) {
      setMaxError("Must be 100 or less");
      valid = false;
    }
    // Min < Max
    if (min && max && Number(min) >= Number(max)) {
      setMaxError(t("errors.invalidRange"));
      valid = false;
    }
    return valid;
  };

  const handleAddRange = async () => {
    if (!validateMinMax(minValue, maxValue)) return;
    setSaving(true);
    const tid = toast.loading("Creating range for all construction types...");
    try {
      const res = await addRangeAction(locale, {
        minYear: Number(minValue),
        maxYear: Number(maxValue),
      });

      if (!res.success) throw new Error(res.error);

      toast.success("New range added successfully!", { id: tid });
      setMinValue("");
      setMaxValue("");
      await reloadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add range", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRange = async () => {
    if (!selectedRangeId) return;
    const range = ranges.find((r) => r.id === selectedRangeId);
    if (!range) return;

    confirm({
      variant: "delete",
      title: t("deleteRangeConfirmTitle"),
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await deleteRangeAction(locale, { minYear: range.min, maxYear: range.max });
          if (!res.success) throw new Error(res.error);
          toast.success(t("success.deleted"));
          await reloadData();
        } catch (err: any) {
          toast.error(err.message || t("errors.delete"));
        } finally {
          setSaving(false);
        }
      },
    });
  };

  /* ================= GRID MAPPING ================= */

  const matrixRows: MatrixRow[] = useMemo(
    () => ranges.map((r) => ({
      id: r.id,
      cells: ratesByRange[r.id] ?? {},
      meta: { range: `${r.min}-${r.max} Years` },
    })),
    [ranges, ratesByRange]
  );

  const matrixColumns: MatrixColumn[] = useMemo(
    () => constructionTypes.map((c) => ({
      id: String(c.constructionId),
      label: c.constructionCode,
      headerClassName: "bg-blue-50 text-blue-900 font-semibold",
    })),
    [constructionTypes]
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <TableHeader title={t("title")} subtitle={t("subtitle")} icon={FileText} />

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl border shadow-sm h-155 flex flex-col p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label={t("min")}
                  required
                  type="number"
                  placeholder={t("minPlaceholder")}
                  value={minValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow only digits, no negative, max 100
                    if (/^\d{0,3}$/.test(val) && (val === '' || Number(val) <= 100)) {
                      setMinValue(val);
                      setMinError(null);
                    }
                  }}
                  error={minError || undefined}
                  min={0}
                  max={100}
                  inputMode="numeric"
                />
                <Input
                  label={t("max")}
                  required
                  type="number"
                  placeholder={t("maxPlaceholder")}
                  value={maxValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,3}$/.test(val) && (val === '' || Number(val) <= 100)) {
                      setMaxValue(val);
                      setMaxError(null);
                    }
                  }}
                  error={maxError || undefined}
                  min={0}
                  max={100}
                  inputMode="numeric"
                />
              </div>

              <AddButton onClick={handleAddRange} disabled={saving} className="w-full">
                {t("addRange")}
              </AddButton>

              <div className="flex-1 overflow-y-auto space-y-2 border-t pt-4">
                {ranges.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    {t("noRanges") || "No ranges available"}
                  </div>
                ) : (
                  ranges.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRangeId(r.id)}
                      className={`w-full p-3 text-center rounded-xl border transition-all ${
                        selectedRangeId === r.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-sm font-semibold">{r.min} - {r.max}</div>
                    </button>
                  ))
                )}
              </div>

              {/* Left Side Pagination */}
              <CardPagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[5, 10, 20, 50]}
                className="border-t pt-2"
              />

              <DeleteButton onClick={handleDeleteRange} disabled={saving || !selectedRangeId} className="w-full">
                {t("deleteRange")}
              </DeleteButton>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl border shadow-sm h-155 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">{t("createDepChart")}</span>
                {selectedRangeId && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                    ACTIVE: {ranges.find(r => r.id === selectedRangeId)?.label}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-auto  text-gray-400">
                <MatrixGrid
                  columns={matrixColumns}
                  rows={matrixRows}
                  metaColumns={[{ id: "range", label: t("yearRange"), width: "140px" }]}
                  mode="edit"
                  editableColumns={constructionTypes.map((c) => String(c.constructionId))}
                  onCellChange={handleCellChange}
                  translations={{
                    action: t("action"),
                    currencySymbol: "₹",
                    deleteRow: t("deleteRow")
                  }}
                />
              </div>

              {/* Right Side Pagination */}
              <CardPagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[5, 10, 20, 50]}
                className="mx-4 mb-2"
              />

              <div className="p-4 border-t flex justify-end rounded-b-2xl text-blue-600">
                <EditButton
                 className="text-black font-bold "
                  onClick={handleUpdateRates} 
                  disabled={saving || Object.keys(pendingChanges).length === 0}
                >
                  {saving ? "Processing..." : `${t("updateRates")} (${Object.keys(pendingChanges).length})`}
                </EditButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}