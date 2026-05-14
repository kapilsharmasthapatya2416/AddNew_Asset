/* eslint-disable i18next/no-literal-string */
"use client";

import { Database, Plus, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/common/Drawer';
import { Card, CardContent, CardHeader, Input, SaveButton, Select, ToggleSwitch } from '@/components/common';
import { useFieldFormModalController } from './useFieldFormModalController';
import { type FieldFormModalProps, type ScreenField } from '@/types/asset.types';

export function FieldFormModal(props: FieldFormModalProps) {
  const {
    formData,
    setFormData,
    newOptionValue,
    setNewOptionValue,
    newRuleFieldId,
    newRuleValues,
    newRuleSubValues,
    isOptionField,
    parentFieldOptions,
    activeSubCategoryOptions,
    activeConditionalRules,
    selectedFieldOptions,
    fieldTypeOptions,
    optionsSourceSelectOptions,
    masterKeyOptions,
    handleSave,
    handleAddOption,
    handleRemoveOption,
    handleApplyConditionalRules,
    handleConditionalFieldChange,
    handleConditionalValueToggle,
    handleSubValueToggle,
    handleManageData,
  } = useFieldFormModalController(props);

  const { isOpen, onClose, existingField } = props;

  if (!isOpen) return null;

  const drawerTitle = (
    <div className="relative -mx-8 w-[calc(100%+64px)]">
      <div className="absolute inset-0 bg-blue-600 shadow-sm rounded-br-xl pointer-events-none" aria-hidden />
      <div className="relative z-10 flex items-start justify-between gap-4 px-8 py-4 text-white">
        <div>
          <h3 className="text-lg font-semibold">{existingField ? 'Edit Field' : 'Add New Field'}</h3>
          <p className="text-xs text-white/80">Define field properties and behavior</p>
        </div>
        <div className="w-8 h-8" aria-hidden />
      </div>
    </div>
  );

  const drawerFooter = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        Cancel
      </button>
      <SaveButton
        type="button"
        onClick={handleSave}
        label={existingField ? 'Update Field' : 'Save Field'}
        className="shadow-sm"
      />
    </>
  );

  return (
    <Drawer open={isOpen} onClose={onClose} width="lg" title={drawerTitle} footer={drawerFooter}>
      <div className="px-6 pt-5 pb-14 space-y-4 max-h-[calc(90vh-160px)] bg-gray-50">
        <Card variant="bordered" padding="md" className="space-y-4 shadow-sm">
          <CardHeader>
            <h4 className="text-sm font-semibold text-blue-800 border-b border-blue-200 pb-2">
              Basic Information
            </h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Input
                fullWidth
                required
                helperText="Technical name (camelCase)"
                label="Field Name"
                placeholder="e.g., assetCategory"
                value={formData.fieldName}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
              />
              <Input
                fullWidth
                required
                label="Display Label"
                placeholder="e.g., Asset Category"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
              <Select
                label="Field Type"
                required
                options={fieldTypeOptions}
                value={formData.fieldType}
                onChange={(value) => {
                  const isDropdown = ['dropdown', 'select', 'multiselect', 'radio', 'checkbox'].includes(value);
                  setFormData({
                    ...formData,
                    fieldType: value as ScreenField['fieldType'],
                    placeholder: isDropdown ? (formData.placeholder || '-- Select --') : formData.placeholder,
                  });
                }}
                selectSize="md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                fullWidth
                label="Placeholder Text"
                placeholder="e.g., Select a category"
                value={formData.placeholder || ''}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              />
              <Input
                fullWidth
                label="Display Order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="flex items-center justify-start gap-2">
                <ToggleSwitch
                  checked={formData.required || false}
                  onChange={(checked) => setFormData({ ...formData, required: checked })}
                  label="Required"
                  showPopup={false}
                />
              </div>

              <div className="flex items-center justify-start gap-2">
                <ToggleSwitch
                  checked={formData.isActive || false}
                  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  label="Active"
                  showPopup={false}
                />
              </div>
            </div>

            {existingField && (
              <div className="text-[10px] text-gray-400 font-mono">ID: {existingField.id}</div>
            )}
          </CardContent>
        </Card>

        {isOptionField && (
          <Card variant="bordered" padding="md" className="space-y-4 shadow-sm">
            <CardHeader>
              <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Data Source
              </h4>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Options Source"
                  options={optionsSourceSelectOptions}
                  value={formData.optionsSource || 'manual'}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      optionsSource: value as ScreenField['optionsSource'],
                      masterKey: value === 'master' ? formData.masterKey : undefined,
                    })
                  }
                  selectSize="md"
                />

                {formData.optionsSource === 'master' && (
                  <Select
                    label="Master Key"
                    placeholder="-- Select Master --"
                    options={masterKeyOptions}
                    value={formData.masterKey || ''}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        masterKey: value || undefined,
                      })
                    }
                    selectSize="md"
                  />
                )}
              </div>

              {formData.optionsSource !== 'manual' && props.onManageData && (
                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleManageData}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100 transition-all text-xs font-semibold"
                  >
                    <Database className="w-3.5 h-3.5" />
                    Manage Dropdown Data Master
                  </button>
                </div>
              )}

              {formData.optionsSource === 'manual' && (
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-orange-900/60 uppercase tracking-widest">
                        Add Dropdown Options
                      </label>
                      <div className="relative">
                        <Input
                          fullWidth
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          placeholder="Enter option here..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOption();
                            }
                          }}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="absolute right-1.5 top-1.5 bottom-1.5 w-8 bg-orange-600 text-white rounded-md flex items-center justify-center hover:bg-orange-700 transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-orange-800 italic">
                    Manual options are stored directly in this field and won&apos;t appear in the central Master Data.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(formData.options || []).map((option, index) => (
                      <div
                        key={`${option.value}-${index}`}
                        className="group flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs hover:border-[#1e3a8a] hover:bg-blue-50/30 transition-all shadow-sm"
                      >
                        <span className="font-bold text-gray-700">{option.label}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(formData.options || []).length === 0 && (
                      <div className="w-full py-8 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-300">
                        <span className="text-[11px] font-bold uppercase tracking-wider">No Options Defined</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {formData.fieldType !== 'dropdown' && (
          <Card variant="bordered" padding="md" className="space-y-4 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">Conditional Display Rules</h4>
                  {activeConditionalRules.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      {activeConditionalRules.length}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-[10px] text-gray-500 italic">
                Configure when this field should be visible based on other field selections.
              </p>

              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    Add Custom Field Condition
                  </h5>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">1. Pick Field</label>
                    <Select
                      label=""
                      options={selectedFieldOptions}
                      value={newRuleFieldId}
                      placeholder="-- Choose Field --"
                      onChange={handleConditionalFieldChange}
                      selectSize="md"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      2. Match Value (Multiselect)
                    </label>
                    <div className="flex-1 min-h-[120px] max-h-[180px] overflow-y-auto bg-white border border-blue-200 rounded-md p-2 space-y-1 shadow-inner">
                      {!newRuleFieldId ? (
                        <p className="text-[10px] text-gray-400 italic text-center py-8">Select a field first...</p>
                      ) : parentFieldOptions.length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic text-center py-8">
                          No values found for this context.
                        </p>
                      ) : (
                        parentFieldOptions.map((option, index) => (
                          <label
                            key={`${option.value}-${index}`}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer group transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={newRuleValues.includes(option.value)}
                              onChange={() => handleConditionalValueToggle(option.value)}
                              className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-700 group-hover:text-blue-900 font-medium">
                              {option.label}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {activeSubCategoryOptions.length > 0 && (
                  <div className="bg-white/50 border border-blue-200 rounded-lg p-3 space-y-2 mt-2">
                    <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                      3. Select Sub Category (for Shopping Complex)
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1">
                      {activeSubCategoryOptions.map((option, index) => (
                        <label
                          key={`${option.value}-${index}`}
                          className="flex items-center gap-2 px-2 py-1 hover:bg-white rounded transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newRuleSubValues.includes(option.value)}
                            onChange={() => handleSubValueToggle(option.value)}
                            className="w-3 h-3 text-blue-500 rounded"
                          />
                          <span className="text-[11px] text-gray-600 font-semibold">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!newRuleFieldId || newRuleValues.length === 0}
                  onClick={handleApplyConditionalRules}
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md text-xs font-bold hover:bg-blue-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98] uppercase tracking-widest"
                >
                  APPLY {newRuleValues.length + newRuleSubValues.length} CONDITIONS
                </button>
              </div>

              {activeConditionalRules.length > 0 && (
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-[11px] font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 uppercase tracking-tight">
                    Active Visibility Logic (OR inside field, AND between fields):
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                    {activeConditionalRules.map((rule, index) => {
                      const parentField = props.availableFields?.find((field) => field.id === rule.fieldId);
                      const fieldDisplay = parentField ? parentField.label : rule.fieldId;

                      return (
                        <div
                          key={`${rule.fieldId}-${String(rule.value)}-${index}`}
                          className="flex items-center gap-2 bg-blue-50/40 px-3 py-2 rounded-lg border border-blue-100 text-xs hover:bg-red-50 hover:border-red-100 transition-colors group"
                        >
                          <span className="font-bold text-[#1e3a8a] line-clamp-1">{fieldDisplay}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase mx-1 whitespace-nowrap">
                            Must be
                          </span>
                          <span className="font-bold text-gray-900 line-clamp-1">{String(rule.value)}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                conditionalDisplay: activeConditionalRules.filter((_, ruleIndex) => ruleIndex !== index),
                              })
                            }
                            className="ml-auto p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeConditionalRules.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  No visibility rules configured. This field will show for all categories.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Drawer>
  );
}
