import type { DepartmentMasterFormData } from '@/types/departmentMaster.types';
import type { ModuleMasterFormData } from '@/types/moduleMaster.types';
import type { YearMasterFormData } from '@/types/yearMaster.types';
import type { PaymentModeFormData } from '@/types/paymentMode.types';

/**
 * Common validation functions for forms
 */
export type Validator = (value: unknown) => string | undefined;

/* ================= CONSTANTS ================= */

// ConstructionTypeMaster
export const CONSTRUCTION_CODE_REGEX = /^[\p{L}\p{M}\p{N}\s\-]+$/u;
export const CONSTRUCTION_CODE_SANITIZE = /[^\p{L}\p{M}\p{N}\s\-]/gu;

// Description: Allow all languages (Marathi, Hindi, English) with basic punctuation
export const DESCRIPTION_REGEX = /^[\p{L}\p{M}\s\/,.\-()0-9\u200C\u200D]+$/u;
export const DESCRIPTION_SANITIZE = /[^\p{L}\p{M}\s\/,.\-()0-9\u200C\u200D]/gu;

//taxZone

export const TEXT_SANITIZE = /[^\p{L}\p{M}\p{N}\s,./-]/gu; // Allow Unicode letters, marks, numbers, spaces, and basic punctuation
export const TEXT_ALLOWED = /^[\p{L}\p{M}\p{N}\s,./-]+$/u; // Validation for allowed characters

// RVRateMaster - Positive decimal validation (only numbers > 0 with decimals allowed)
export const POSITIVE_DECIMAL_REGEX = /^(?!0(\.0+)?$)\d+(\.\d+)?$/;
export const POSITIVE_DECIMAL_INVALID_KEYS = /^[eE+\-]$/; // Regex pattern to match invalid keys for positive decimal input

/**
 * Validate positive decimal number (greater than 0, no negative, no letters, no special chars)
 * @param value - The value to validate
 * @returns true if valid positive decimal, false otherwise
 */
export const isPositiveDecimal = (value: string | number): boolean => {
  if (value === '' || value === null || value === undefined) return false;
  const strValue = String(value).trim();
  return POSITIVE_DECIMAL_REGEX.test(strValue) && Number(strValue) > 0;
};

/**
 * Sanitize input to allow only positive decimal numbers
 * Removes any invalid characters and ensures value is positive
 * @param value - The input value
 * @returns Sanitized positive decimal value or empty string
 */
export const sanitizePositiveDecimal = (value: string): string => {
  // Remove all non-numeric characters except dot
  let sanitized = value.replace(/[^\d.]/g, '');

  // Allow only one decimal point
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = parts[0] + '.' + parts.slice(1).join('');
  }

  // Remove leading zeros (except for decimals like 0.5)
  if (sanitized.startsWith('0') && sanitized.length > 1 && !sanitized.startsWith('0.')) {
    sanitized = sanitized.replace(/^0+/, '');
  }

  return sanitized;
};
// Department & Module Master
export const DEPARTMENT_CODE_REGEX = /^[A-Za-z0-9]+$/;
export const DEPARTMENT_CODE_MAX = 20;

export const MODULE_CODE_REGEX = /^[A-Za-z0-9]+$/;
export const MODULE_CODE_MAX = 20;

// Year Master
export const YEAR_CODE_REGEX = /^[A-Za-z0-9\-]+$/;
export const YEAR_CODE_MAX = 20;

// Payment Mode Master
export const PAYMENT_MODE_CODE_REGEX = /^[A-Za-z0-9]+$/;
export const PAYMENT_MODE_CODE_MAX = 20;
/**
 * Generic form validation function
 */
export const validateForm = (
  data: unknown,
  schema: Record<string, Validator>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const formData =
    typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};

  Object.keys(schema).forEach((key) => {
    const validator = schema[key];
    if (validator) {
      const error = validator(formData[key]);
      if (error) errors[key] = error;
    }
  });

  return errors;
};

export const hasErrors = (errors: Record<string, string>) => Object.keys(errors).length > 0;

export const commonValidations = {
  code:
    (
      label: string,
      t: (key: string, values?: Record<string, string | number | Date>) => string
    ): Validator =>
    (value: unknown) => {
      const strVal = String(value || '');
      if (!strVal || !strVal.trim()) return t('validation.required', { label });
      if (!/^[a-zA-Z0-9-]+$/.test(strVal)) return t('validation.alphanumeric', { label });
      if (strVal.length > 50) return t('validation.tooLong', { label });
      return undefined;
    },

  name:
    (
      label: string,
      t: (key: string, values?: Record<string, string | number | Date>) => string
    ): Validator =>
    (value: unknown) => {
      const strVal = String(value || '');
      if (!strVal || !strVal.trim()) return t('validation.required', { label });
      if (strVal.length > 100) return t('validation.tooLong', { label });
      return undefined;
    },

  description:
    (
      label: string,
      t: (key: string, values?: Record<string, string | number | Date>) => string,
      required: boolean = false
    ): Validator =>
    (value: unknown) => {
      const strVal = String(value || '');
      if (required && (!strVal || !strVal.trim())) return t('validation.required', { label });
      if (strVal && strVal.length > 500) return t('validation.tooLong', { label });
      return undefined;
    },
};

/* ================= PAGE SPECIFIC VALIDATION ================= */

export const validateDepartmentMaster = (
  data: DepartmentMasterFormData,
  t: (key: string) => string
): Record<string, string> => {
  const e: Record<string, string> = {};

  if (!data.departmentCode.trim()) {
    e.departmentCode = t('form.validation.codeRequired');
  } else if (data.departmentCode.length > DEPARTMENT_CODE_MAX) {
    e.departmentCode = t('form.validation.codeMaxLength');
  } else if (!DEPARTMENT_CODE_REGEX.test(data.departmentCode)) {
    e.departmentCode = t('form.validation.codeInvalidResult');
  }

  if (!data.departmentName.trim()) {
    e.departmentName = t('form.validation.nameRequired');
  }

  return e;
};

export const validateModuleMaster = (
  data: ModuleMasterFormData,
  t: (key: string) => string
): Record<string, string> => {
  const e: Record<string, string> = {};

  if (!data.departmentId) {
    e.departmentId = t('form.validation.departmentRequired');
  }

  if (!data.moduleCode.trim()) {
    e.moduleCode = t('form.validation.codeRequired');
  } else if (data.moduleCode.length > MODULE_CODE_MAX) {
    e.moduleCode = t('form.validation.codeMaxLength');
  } else if (!MODULE_CODE_REGEX.test(data.moduleCode)) {
    e.moduleCode = t('form.validation.codeInvalidResult');
  }

  if (!data.moduleName.trim()) {
    e.moduleName = t('form.validation.nameRequired');
  }

  return e;
};

export const validateYearMaster = (
  data: YearMasterFormData,
  t: (key: string) => string
): Record<string, string> => {
  const e: Record<string, string> = {};

  if (!data.yearCode.trim()) {
    e.yearCode = t('form.validation.codeRequired');
  } else if (data.yearCode.length > YEAR_CODE_MAX) {
    e.yearCode = t('form.validation.codeMaxLength');
  } else if (!YEAR_CODE_REGEX.test(data.yearCode)) {
    e.yearCode = t('form.validation.codeInvalidResult');
  }

  if (!data.startDate) {
    e.startDate = t('form.validation.startDateRequired');
  }

  if (!data.endDate) {
    e.endDate = t('form.validation.endDateRequired');
  } else if (data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
    e.endDate = t('form.validation.endDateInvalid');
  }

  return e;
};

export const validatePaymentMode = (
  data: PaymentModeFormData,
  t: (key: string) => string
): Record<string, string> => {
  const e: Record<string, string> = {};

  if (!data.code.trim()) {
    e.code = t('form.validation.codeRequired');
  } else if (data.code.length > PAYMENT_MODE_CODE_MAX) {
    e.code = t('form.validation.codeMaxLength');
  } else if (!PAYMENT_MODE_CODE_REGEX.test(data.code)) {
    e.code = t('form.validation.codeInvalidResult');
  }

  if (!data.paymentModeName.trim()) {
    e.paymentModeName = t('form.validation.nameRequired');
  }

  return e;
};

export const validateDepartmentActivation = () => {
  return true;
};

export const isValidLocale = (locale: string): boolean => {
  return ['en', 'hi', 'mr'].includes(locale);
};

export const isValidId = (id: unknown): boolean => {
  if (typeof id === 'number') return id > 0;
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return !isNaN(parsed) && parsed > 0;
  }
  return false;
};

export const validateGrievanceCategory = (
  data: Record<string, unknown>,
  t: (key: string) => string
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const categoryCode = typeof data.categoryCode === 'string' ? data.categoryCode.trim() : '';
  const categoryName = typeof data.categoryName === 'string' ? data.categoryName.trim() : '';

  if (!categoryCode) errors.categoryCode = t('codeReq');
  if (!categoryName) errors.categoryName = t('nameReq');
  if (!data.departmentId) errors.departmentId = t('departmentReq');

  const sla = typeof data.resolutionSla === 'string' ? data.resolutionSla.trim() : '';
  if (!sla) errors.resolutionSla = t('slaReq');

  return errors;
};

export const SERVICE_CATEGORY_ALLOWED_ERROR_KEYS = ['categoryCode', 'categoryName', 'departmentId'];

export const getServiceCategoryFormErrors = (
  data: unknown,
  t?: (key: string) => string
): string[] => {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') return errors;

  const translate = t || ((key: string) => key);
  const d = data as Record<string, unknown>;

  const categoryCode =
    typeof d.categoryCode === 'string'
      ? (d.categoryCode as string).trim()
      : typeof d.serviceCode === 'string'
        ? (d.serviceCode as string).trim()
        : '';
  const categoryName =
    typeof d.categoryName === 'string'
      ? (d.categoryName as string).trim()
      : typeof d.serviceName === 'string'
        ? (d.serviceName as string).trim()
        : '';

  if (!categoryCode) errors.push(translate('categoryCodeRequired'));
  if (!categoryName) errors.push(translate('categoryNameRequired'));
  if (!d.departmentId) errors.push(translate('departmentRequired'));
  return errors;
};

export const sanitizeServiceCategoryData = (data: unknown): Record<string, unknown> =>
  data as Record<string, unknown>;

export const buildPreservedQueryString = (_params: unknown): string => '';
export const getPreservedParams = (_params: unknown): Record<string, string> => ({});

export const createGrievanceCategoryValidationTranslator = (
  t: unknown
): ((key: string) => string) => {
  return (key: string) => {
    const trans = t as Record<string, Record<string, string>>;
    if (key && trans?.errors && trans.errors[key]) {
      return trans.errors[key];
    }
    return key;
  };
};

export const normalizeGrievanceCategoryFieldValue = (field: string, val: unknown): unknown => {
  if (field === 'categoryCode' && typeof val === 'string') {
    return val.toUpperCase();
  }
  return val;
};

export const resolveGrievanceCategoryServerError = (err: unknown, tErrors: unknown): string => {
  const errorKey = typeof err === 'string' ? err : 'unexpected';
  const normalizedKey = errorKey.startsWith('errors.') ? errorKey.split('.').pop()! : errorKey;
  const translatedErrors = tErrors as Record<string, string>;
  return translatedErrors?.[normalizedKey] || translatedErrors?.unexpected || errorKey;
};

export const validateGrievanceCategoryField = (
  formData: Record<string, unknown>,
  field: string,
  _val: unknown,
  t: (key: string) => string
): string | null => {
  const errors = validateGrievanceCategory(formData, t);
  return errors[field] || null;
};
