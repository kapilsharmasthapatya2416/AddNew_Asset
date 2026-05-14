"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  Type,
  Hash,
  Calendar,
  ChevronDown,
  Mail,
  Phone,
  FileText,
  CheckSquare,
  List,
  Radio,
  Upload,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Database,
} from 'lucide-react';
import type { FieldListProps, ScreenField, FieldType } from '@/types/asset.types';
import { Card, CardContent, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { SearchInput } from '@/components/common/SearchInput';
import { Select } from '@/components/common/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AddButton, EditButton, DeleteButton, IconButton, PrevPageButton, NextPageButton, PageNumberButton } from '@/components/common/ActionButtons';
import { Table } from '@/components/common/Table';
import type { TableColumn } from '@/types/common.types';
import { Tooltip } from '@/components/common/Tooltip';

type FieldRow = ScreenField & {
  sourceSectionId?: string;
  sourceSectionLabel?: string;
  sourceScreenName?: string;
  sourceScreenId?: string;
  originalId?: string;
};

const fieldTypeIcons: Record<FieldType, any> = {
  text: Type,
  textarea: FileText,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  dropdown: ChevronDown,
  select: ChevronDown,
  radio: Radio,
  checkbox: CheckSquare,
  file: Upload,
  multiselect: List,
  button: Plus,
};

const fieldTypeOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File' },
  { value: 'multiselect', label: 'Multi-Select' },
];

const ITEMS_PER_PAGE = 5;

const MotionEditButton = motion(EditButton);
const MotionDeleteButton = motion(DeleteButton);
const MotionIconButton = motion(IconButton);

export function FieldList({
  fields,
  groupedFieldCount,
  variantCount,
  onAddField,
  onEditField,
  onDeleteField,
  onToggleFieldStatus,
  onReorderField,
  onManageData,
  sectionName,
}: FieldListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFieldType, setFilterFieldType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterFieldType, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [fields, sectionName]);

  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const matchesSearch =
        searchTerm === '' ||
        field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.fieldName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFieldType =
        filterFieldType === 'all' || field.fieldType === filterFieldType;

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && field.isActive) ||
        (filterStatus === 'inactive' && !field.isActive);

      return matchesSearch && matchesFieldType && matchesStatus;
    });
  }, [fields, searchTerm, filterFieldType, filterStatus]);

  const sortedFields = useMemo(() => {
    return [...filteredFields].sort((a, b) => a.order - b.order);
  }, [filteredFields]);

  const totalPages = Math.ceil(sortedFields.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = sortedFields.slice(startIndex, endIndex);
  const tableData = useMemo(
    () =>
      currentPageData.map((field, index) => ({
        ...field,
        originalId: field.originalId || field.id,
        id: `${field.id}__${field.sourceSectionId || 'section'}__${startIndex + index}`,
      })),
    [currentPageData, startIndex]
  );

  const selectableTypes: FieldType[] = ['dropdown', 'select', 'multiselect', 'radio'];

  const columns = useMemo<TableColumn<FieldRow>[]>(
    () => [
      {
        key: 'order',
        label: 'Order',
        render: (_, field) => {
          const stableFieldId = field.originalId || field.id;
          const globalIndex = sortedFields.findIndex((f) => f.id === stableFieldId);
          return (
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                #{field.order}
              </span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onReorderField(stableFieldId, 'up')}
                  disabled={globalIndex === 0}
                  className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ChevronLeft className="w-3 h-3 text-gray-600 rotate-90" />
                </button>
                <button
                  onClick={() => onReorderField(stableFieldId, 'down')}
                  disabled={globalIndex === sortedFields.length - 1}
                  className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 rotate-90" />
                </button>
              </div>
            </div>
          );
        },
      },
      {
        key: 'label',
        label: 'Label',
        render: (_, field) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{field.label}</span>
              {field.required && (
                <Badge variant="destructive" size="sm" className="uppercase tracking-wide">
                  Required
                </Badge>
              )}
            </div>
            {field.helpText && (
              <div className="flex items-start gap-1 text-xs text-blue-700 max-w-xs">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{field.helpText}</span>
              </div>
            )}
            {field.sourceSectionLabel && (
              <Badge
                variant="default"
                size="sm"
                className="text-[10px] font-normal text-purple-600 bg-purple-50 border-purple-100"
              >
                Source: {field.sourceSectionLabel}
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: 'fieldName',
        label: 'Field Name',
        render: (_, field) => (
          <span className="text-sm font-mono text-gray-700">{field.fieldName}</span>
        ),
      },
      {
        key: 'fieldType',
        label: 'Field Type',
        render: (_, field) => {
          const Icon = fieldTypeIcons[field.fieldType] || FileText;
          return (
            <div className="flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium w-fit">
              <Icon className="w-3.5 h-3.5" />
              <span className="capitalize">{field.fieldType}</span>
            </div>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
        render: (_, field) => (
            <button
            onClick={() => onToggleFieldStatus(field.originalId || field.id, field.sourceSectionId)}
            className="inline-flex items-center justify-center p-0 transition-colors"
          >
            <StatusBadge
              value={field.isActive ? 'Active' : 'Inactive'}
              activeLabel="Active"
              inactiveLabel="Inactive"
            />
          </button>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
        render: (_, field) => (
          <div className="flex items-center justify-center gap-1.5">
            {selectableTypes.includes(field.fieldType) && onManageData && (
              <Tooltip content="Manage dropdown data">
                <MotionIconButton
                  icon={Database}
                  variant="primary"
                  aria-label="Manage Dropdown Data"
                  className="h-8 w-8 rounded-md"
                  onClick={() => onManageData({ ...field, id: field.originalId || field.id })}
                />
              </Tooltip>
            )}
            <Tooltip content="Edit field">
              <MotionEditButton
                aria-label="Edit field"
                onClick={() => onEditField({ ...field, id: field.originalId || field.id })}
              />
            </Tooltip>
            <Tooltip content="Delete field">
              <MotionDeleteButton
                aria-label="Delete field"
                onClick={() => onDeleteField(field.originalId || field.id, field.sourceSectionId)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [selectableTypes, sortedFields, onReorderField, onToggleFieldStatus, onManageData, onEditField, onDeleteField]
  );

  const emptyMessage =
    fields.length === 0
      ? 'No fields yet. Add a field to get started.'
      : 'No fields match the current search or filters.';

  return (
     <Card padding="none" className="h-full flex flex-col border border-gray-200 overflow-hidden ">
      <CardHeader className="bg-slate-900 border-b border-slate-700 px-5 py-3 shadow-sm rounded-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <List className="w-4 h-4" />
            Fields Data Grid
          </div>
          <AddButton
            label="Add Field"
            onClick={onAddField}
            size="xs"
            className="px-3 py-1.5 text-xs font-semibold"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden -mt-4">
        {sectionName && (
          <div className="px-4 py-2 bg-purple-50 border-b border-purple-200 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-purple-700 font-medium truncate">
              Section: {sectionName}
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-600 flex-wrap">
              <Badge variant="destructive" size="sm">
                {groupedFieldCount ?? fields.length} fields
              </Badge>
              {typeof variantCount === 'number' && variantCount > 1 && (
                <Badge variant="default" size="sm">
                  {variantCount} variants
                </Badge>
              )}
              <Badge variant="success" size="sm">
                {fields.filter((f) => f.isActive).length} active
              </Badge>
            </div>
          </div>
        )}

        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-6">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by Label, Field Name..."
                className="!w-full mb-0 [&_input]:py-1 [&_input]:text-xs"
                showClear
              />
            </div>
            <div className="col-span-6">
              <label className="block text-xs font-medium text-gray-700 mb-1">Field Type</label>
              <Select
                options={fieldTypeOptions}
                value={filterFieldType}
                onChange={(value) => setFilterFieldType(value)}
                placeholder="All Types"
                className="w-full"
                selectSize="sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">Status:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('inactive')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'inactive'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Showing <span className="font-semibold">{sortedFields.length}</span> of{' '}
              <span className="font-semibold">{fields.length}</span> fields
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-360px)]">
            <Table
              data={tableData}
              columns={columns}
              className="w-full text-sm"
              tableClassName="text-sm"
              headClassName="bg-slate-600"
              headerCellClassName="text-white"
              cellClassName="px-3 py-2.5 align-top"
              rowClassName={(row) => (row.isActive ? undefined : 'bg-gray-50 opacity-70')}
              emptyMessage={emptyMessage}
            />
          </div>
        </div>

        {sortedFields.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(endIndex, sortedFields.length)}</span> of{' '}
                <span className="font-semibold">{sortedFields.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <PrevPageButton
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PageNumberButton
                      key={page}
                      page={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    />
                  ))}
                </div>
                <NextPageButton
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
