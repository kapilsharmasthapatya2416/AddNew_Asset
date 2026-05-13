import { vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));

// Mock sonner toast
export const mockToastSuccess = vi.fn();
export const mockToastError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (msg: string) => mockToastSuccess(msg),
    error: (msg: string) => mockToastError(msg),
  },
}));

// Mock actions
vi.mock('@/app/[locale]/configuration-settings/department-activation/action', () => ({
    updateDepartmentStatusAction: vi.fn().mockResolvedValue({ success: true }),
    updateModuleStatusAction: vi.fn().mockResolvedValue({ success: true }),
    bulkUpdateDepartmentStatusAction: vi.fn().mockResolvedValue({ success: true }),
}));
