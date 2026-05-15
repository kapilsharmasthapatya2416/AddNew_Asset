'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Drawer, MasterTable, type Column } from '@/components/common';
import {
  ValuationDetailsData,
  ValuationDetailSection,
} from '@/types/valuation.types';
import { Building2, Car, IndianRupee, Laptop, Sofa, Zap } from 'lucide-react';
import TableHeader from '@/components/common/TableHeader';

interface ValuationDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  section: ValuationDetailSection | null;
  details: ValuationDetailsData;
}

type TableRow = Record<string, unknown>;

const currencyFormatter = new Intl.NumberFormat('en-IN');
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

const iconMap = {
  building: Building2,
  furniture: Sofa,
  itEquipment: Laptop,
  electronics: Zap,
  vehicles: Car,
  grandTotal: IndianRupee,
} as const;

function toTableColumns(columns: Array<{ key: string; label: string }>): Column<TableRow>[] {
  return columns.map((column) => ({
    key: column.key as keyof TableRow,
    label: column.label,
  }));
}

function withRowIds(rows: Array<Record<string, string | number>>): TableRow[] {
  return rows.map((row, index) => ({
    id: `row-${index + 1}`,
    ...row,
  }));
}

export default function ValuationDetailsDrawer({
  open,
  onClose,
  section,
  details,
}: ValuationDetailsDrawerProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const meta = section ? details[section] : null;
  const Icon = meta ? iconMap[meta.iconKey as keyof typeof iconMap] : Building2;
  const tableColumns = meta ? toTableColumns(meta.columns) : [];
  const tableRows = meta ? withRowIds(meta.rows) : [];
  const totalCount = tableRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    setPageNumber(1);
  }, [section, open]);

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return tableRows.slice(start, start + pageSize);
  }, [tableRows, pageNumber, pageSize]);

  if (!section || !meta) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="xl"
      title={
        <div className="w-full">
          <TableHeader
            title={meta.title}
            subtitle={meta.subtitle}
            icon={Icon}
            className="border-0! bg-transparent! shadow-none! p-0!"
          />
        </div>
      }
    >
      <div className="min-h-full bg-slate-100 p-4">
        <Card className="overflow-hidden rounded-xl border border-slate-200 p-0">
          
          <div className="p-4">
            <MasterTable
              columns={tableColumns}
              data={paginatedRows}
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={setPageNumber}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPageNumber(1);
              }}
              paginationConfig={{
                enabled: true,
                showPageSizeSelector: true,
              }}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              getRowKey={(row, index) => (row.id as string) ?? index}
              containerClassName="mt-2"
              tableClassName="min-w-max"
              maxBodyHeightClassName="max-h-[52vh]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-blue-200 px-4 py-3 text-sm font-semibold text-slate-800">
            <span>{meta.totalLabel}:</span>
            <span className="inline-flex items-center gap-1 text-blue-900">
              <IndianRupee className="h-4 w-4" />
              {currencyFormatter.format(meta.totalValue)}
            </span>
          </div>
        </Card>
      </div>
    </Drawer>
  );
}
