import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';

import { FloorRangeFields } from '@/components/modules/property-tax/Floormaster/floor/FloorRangeFields';
import type { FloorRangeFormModel } from '@/types/floor.types';

// ── i18n messages ─────────────────────────────────────────────────────────────
const messages = {
  floor: {
    floor: {
      form: {
        status: 'Status',
        activeStatusTitle: 'Floor Status',
        activeStatusOn: 'Active',
        activeStatusOff: 'Inactive',
        range: {
          title: 'Floor Range',
          start: 'Start',
          end: 'End',
          startPlaceholder: '1',
          endPlaceholder: '10',
        },
        englishName: {
          title: 'English Name',
          prefix: 'Prefix',
          prefixPlaceholder: 'First',
          suffix: 'Suffix',
          suffixPlaceholder: 'Floor',
        },
      
        autoGenerateSubFloor: 'Auto-Generate SubFloor',
        autoGenerateSubFloorDesc: 'Creates a subfloor for every floor in the range',
        rangeExample: 'Example: Range 1-5 creates 1F, 2F, 3F, 4F, 5F',
        validation: {
          rangeStartMinValue: 'Start value must be at least 1',
          rangeEndMinValue: 'End value must be at least 1',
          rangeStartLessThanEnd: 'Start must be less than or equal to End',
          rangeMaxValue: 'Value cannot exceed {count}',
        },
      },
    },
  },
};

// ── Default form data ─────────────────────────────────────────────────────────
const defaultFormData: FloorRangeFormModel = {
  rangeFrom: 1,
  rangeTo: 10,
  prefix: '',
  suffix: 'Floor',
  floorCode: '0',
  isActive: true,
  autoGenerateSubFloor: false,
};

// ── Render helper ─────────────────────────────────────────────────────────────
function renderFloorRangeFields(
  props: Partial<{
    formData: FloorRangeFormModel;
    errors: Partial<Record<keyof FloorRangeFormModel, string>>;
    showError: (field: keyof FloorRangeFormModel) => boolean;
    onChange: (field: keyof FloorRangeFormModel, value: string | number | boolean) => void;
    onBlur: (field: keyof FloorRangeFormModel) => void;
  }> = {}
) {
  const defaultProps = {
    formData: defaultFormData,
    errors: {},
    showError: () => false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
  };

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FloorRangeFields {...defaultProps} {...props} />
    </NextIntlClientProvider>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('FloorRangeFields', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders Floor Range section with Start and End fields', () => {
    renderFloorRangeFields();
    
    expect(screen.getByText('Floor Range')).toBeInTheDocument();
    expect(screen.getByLabelText(/Start/)).toBeInTheDocument();
    expect(screen.getByLabelText(/End/)).toBeInTheDocument();
  });

  it('renders Status section', () => {
    renderFloorRangeFields();
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Floor Status')).toBeInTheDocument();
  });

  it('renders English Name section with Prefix and Suffix', () => {
    renderFloorRangeFields();
    
    expect(screen.getByText('English Name')).toBeInTheDocument();
    const prefixLabels = screen.getAllByText('Prefix');
    const suffixLabels = screen.getAllByText('Suffix');
    
    expect(prefixLabels.length).toBeGreaterThanOrEqual(2);
    expect(suffixLabels.length).toBeGreaterThanOrEqual(2);
  });

  it('renders Regional Name section', () => {
    renderFloorRangeFields();
    
    expect(screen.getByText('Regional Name')).toBeInTheDocument();
  });

  it('renders Auto-Generate SubFloor checkbox', () => {
    renderFloorRangeFields();
    
    expect(screen.getByText('Auto-Generate SubFloor')).toBeInTheDocument();
    expect(screen.getByText('Creates a subfloor for every floor in the range')).toBeInTheDocument();
  });

  it('renders example info message', () => {
    renderFloorRangeFields();
    
    expect(screen.getByText(/Example: Range 1-5 creates 1F, 2F, 3F, 4F, 5F/)).toBeInTheDocument();
  });

  it('calls onChange when Start value is changed', () => {
    const onChangeMock = vi.fn();
    renderFloorRangeFields({ onChange: onChangeMock });
    
    const startInput = screen.getByLabelText(/Start/);
    fireEvent.change(startInput, { target: { value: '5' } });
    
    expect(onChangeMock).toHaveBeenCalledWith('rangeFrom', 5);
  });

  it('calls onChange when End value is changed', () => {
    const onChangeMock = vi.fn();
    renderFloorRangeFields({ onChange: onChangeMock });
    
    const endInput = screen.getByLabelText(/End/);
    fireEvent.change(endInput, { target: { value: '20' } });
    
    expect(onChangeMock).toHaveBeenCalledWith('rangeTo', 20);
  });

  it('calls onBlur when Start input loses focus', () => {
    const onBlurMock = vi.fn();
    renderFloorRangeFields({ onBlur: onBlurMock });
    
    const startInput = screen.getByLabelText(/Start/);
    fireEvent.blur(startInput);
    
    expect(onBlurMock).toHaveBeenCalledWith('rangeFrom');
  });

  it('calls onBlur when End input loses focus', () => {
    const onBlurMock = vi.fn();
    renderFloorRangeFields({ onBlur: onBlurMock });
    
    const endInput = screen.getByLabelText(/End/);
    fireEvent.blur(endInput);
    
    expect(onBlurMock).toHaveBeenCalledWith('rangeTo');
  });

  it('displays validation error when showError returns true', () => {
    renderFloorRangeFields({
      errors: { rangeFrom: 'Start value must be at least 1' },
      showError: (field) => field === 'rangeFrom',
    });
    
    expect(screen.getByText('Start value must be at least 1')).toBeInTheDocument();
  });

  it('calls onChange when prefix is changed', () => {
    const onChangeMock = vi.fn();
    renderFloorRangeFields({ onChange: onChangeMock });
    
    const prefixInput = screen.getByPlaceholderText('Auto-numbering');
    fireEvent.change(prefixInput, { target: { value: 'Test' } });
    
    expect(onChangeMock).toHaveBeenCalledWith('prefix', 'Test');
  });

  it('calls onChange when suffix is changed', () => {
    const onChangeMock = vi.fn();
    renderFloorRangeFields({ onChange: onChangeMock });
    
    const suffixInput = screen.getByPlaceholderText('Floor');
    fireEvent.change(suffixInput, { target: { value: 'F' } });
    
    expect(onChangeMock).toHaveBeenCalledWith('suffix', 'F');
  });

  it('displays initial form values correctly', () => {
    renderFloorRangeFields();
    
    const startInput = screen.getByLabelText(/Start/) as HTMLInputElement;
    const endInput = screen.getByLabelText(/End/) as HTMLInputElement;
    
    expect(startInput.value).toBe('1');
    expect(endInput.value).toBe('10');
  });
});
