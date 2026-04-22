/**
 * Society form validations
 */

export const PERSON_NAME_REGEX = /^[\p{L}\p{M}\s.,'-]+$/u;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_10_REGEX = /^[0-9]{10}$/;

export type Validator = (value: unknown) => string | undefined;

export const societyValidations = {
  personName:
    (
      label: string,
      t: (key: string, values?: Record<string, string | number | Date>) => string
    ): Validator =>
    (value: unknown) => {
      const strVal = String(value ?? "").trim();
      if (!strVal) return undefined; // optional field
      if (!PERSON_NAME_REGEX.test(strVal)) {
        return t(`society.validation.${label}`);
      }
      return undefined;
    },

  email:
    (
      label: string,
      t: (key: string, values?: Record<string, string | number | Date>) => string
    ): Validator =>
    (value: unknown) => {
      const strVal = String(value ?? "").trim();
      if (!strVal) return undefined; // optional field
      if (!EMAIL_REGEX.test(strVal)) {
        return t(`society.validation.${label}`);
      }
      return undefined;
    },

  mobile10:
    (
      label: string,
      t: (key: string, values?: Record<string, string | number | Date>) => string
    ): Validator =>
    (value: unknown) => {
      const strVal = String(value ?? "").trim();
      if (!strVal) return undefined; // optional field
      if (!MOBILE_10_REGEX.test(strVal)) {
        return t(`society.validation.${label}`);
      }
      return undefined;
    },
};

/**
 * Generic form validation function.
 * Runs each validator in the schema against the corresponding field in the data object.
 */
export const validateForm = (
  data: Record<string, unknown>,
  schema: Record<string, Validator>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(schema).forEach((key) => {
    const validator = schema[key];
    if (validator) {
      const error = validator(data[key]);
      if (error) errors[key] = error;
    }
  });

  return errors;
};

/**
 * Check if a validation result has any errors.
 */
export const hasErrors = (errors: Record<string, string>): boolean =>
  Object.keys(errors).length > 0;
