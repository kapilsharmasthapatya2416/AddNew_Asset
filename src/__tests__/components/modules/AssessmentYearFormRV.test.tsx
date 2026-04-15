import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import AssessmentYearFormRV from '@/components/modules/property-tax/AssessmentYearRange/RateableValue/AssessmentYearFormRV';
import * as actions from '@/app/[locale]/property-tax/assessment-year-range/rateablevalue/action';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/app/[locale]/property-tax/assessment-year-range/rateablevalue/action', () => ({
  createAssessmentYearAction: vi.fn(),
  updateAssessmentYearAction: vi.fn(),
  checkAssessmentYearOverlap: vi.fn(),
}));

describe('AssessmentYearFormRV', () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  };

  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    vi.spyOn(actions, 'checkAssessmentYearOverlap').mockResolvedValue({ hasOverlap: false });
  });

  describe('Component Rendering', () => {
    it('should render form in add mode', () => {
      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('formTitleAdd')).toBeInTheDocument();
      expect(screen.getByText('formSubtitleAdd')).toBeInTheDocument();
    });

    it('should render form in edit mode with initial data', () => {
      const initialData: any = {
        yearId: 1,
        yearRangeRVId: 1,
        fromYear: 2023,
        toYear: 2024,
        isActive: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
          initialData={initialData}
        />
      );

      expect(screen.getByText('formTitleEdit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2023')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show required field errors', async () => {
      const user = userEvent.setup();
      
      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('fromYearRequired')).toBeInTheDocument();
        expect(screen.getByText('toYearRequired')).toBeInTheDocument();
      });
    });

    it('should validate year format (4 digits)', async () => {
      const user = userEvent.setup();
      
      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
        />
      );

      const fromYearInput = screen.getByPlaceholderText('fromYearPlaceholder');
      const toYearInput = screen.getByPlaceholderText('toYearPlaceholder');

      await user.type(fromYearInput, '23');
      await user.type(toYearInput, '24');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('fromYearFourDigits')).toBeInTheDocument();
        expect(screen.getByText('toYearFourDigits')).toBeInTheDocument();
      });
    });

    it('should check for overlap and show error', async () => {
      const user = userEvent.setup();
      vi.spyOn(actions, 'checkAssessmentYearOverlap').mockResolvedValue({ hasOverlap: true });
      
      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
        />
      );

      const fromYearInput = screen.getByPlaceholderText('fromYearPlaceholder');
      const toYearInput = screen.getByPlaceholderText('toYearPlaceholder');

      await user.type(fromYearInput, '2023');
      await user.type(toYearInput, '2024');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getAllByText('overlapError')).toHaveLength(2);
      });
    });
  });

  describe('Form Submission', () => {
    it('should create new record successfully', async () => {
      const user = userEvent.setup();
      vi.spyOn(actions, 'createAssessmentYearAction').mockResolvedValue({ success: true, data: {} as any });
      
      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const fromYearInput = screen.getByPlaceholderText('fromYearPlaceholder');
      const toYearInput = screen.getByPlaceholderText('toYearPlaceholder');

      await user.type(fromYearInput, '2023');
      await user.type(toYearInput, '2024');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(actions.createAssessmentYearAction).toHaveBeenCalledWith({
          fromYear: 2023,
          toYear: 2024,
          isActive: true,
        });
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
        expect(mockRouter.refresh).toHaveBeenCalled();
      });
    });

    it('should update existing record successfully', async () => {
      const user = userEvent.setup();
      const initialData: any = {
        yearId: 1,
        yearRangeRVId: 1,
        fromYear: 2023,
        toYear: 2024,
        isActive: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      vi.spyOn(actions, 'updateAssessmentYearAction').mockResolvedValue({ success: true, data: {} as any });
      
      render(
        <AssessmentYearFormRV
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          initialData={initialData}
        />
      );

      const saveButton = screen.getByRole('button', { name: /update/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(actions.updateAssessmentYearAction).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });
});
