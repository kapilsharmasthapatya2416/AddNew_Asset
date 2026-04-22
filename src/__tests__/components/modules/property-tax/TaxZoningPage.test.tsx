import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaxZoningPage from "@/components/modules/property-tax/taxzoningmaster/TaxZoningPage";
import { NextIntlClientProvider } from "next-intl";

// Mock the hook
vi.mock("@/hooks/useTaxZoning", () => ({
  useTaxZoning: vi.fn(() => ({
    t: (key: string) => key,
    zone: "",
    setZone: vi.fn(),
    ward: [],
    setWard: vi.fn(),
    fromProps: "",
    setFromProps: vi.fn(),
    toProps: "",
    setToProps: vi.fn(),
    fileInputRef: { current: null },
    zoneOptions: [],
    wardOptions: [],
    propertyOptionsByWard: [],
    loading: false,
    pageSizeOptions: [5, 10],
    pageSizes: "10",
    currentPage: 1,
    submitted: false,
    saving: false,
    previewPage: 1,
    setPreviewPage: vi.fn(),
    PREVIEW_PAGE_SIZE: 5,
    hasImportedData: false,
    changePage: vi.fn(),
    changePageSize: vi.fn(),
    tableRecords: [],
    previewData: [],
    pagedPreviewData: [],
    columns: [],
    previewColumns: [],
    handleExportCSV: vi.fn(),
    handleImportFile: vi.fn(),
    handleSubmit: vi.fn(),
    handleBulkUpdate: vi.fn(),
    handleClearImported: vi.fn(),
    isTaxZoneValid: true,
    isWardValid: true,
    isPropertyValid: true,
    isFormValid: true,
    onFormClear: vi.fn(),
  })),
}));

// Mock sub-components to focus on Page structure
vi.mock("@/components/modules/property-tax/taxzoningmaster/TaxZoningForm", () => ({
  TaxZoningForm: () => <div data-testid="tax-zoning-form" />
}));
vi.mock("@/components/modules/property-tax/taxzoningmaster/TaxZoningPreview", () => ({
  TaxZoningPreview: () => <div data-testid="tax-zoning-preview" />
}));
vi.mock("@/components/modules/property-tax/taxzoningmaster/TaxZoningTable", () => ({
  TaxZoningTable: () => <div data-testid="tax-zoning-table" />
}));

describe("TaxZoningPage", () => {
  const mockProps = {
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    taxZones: { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPrevious: false, hasNext: false },
    wardsData: { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPrevious: false, hasNext: false },
    allProperties: { success: true as const, data: { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPrevious: false, hasNext: false } },
  };

  it("renders TableHeader and all sub-sections", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <TaxZoningPage {...mockProps} />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByTestId("tax-zoning-form")).toBeInTheDocument();
    expect(screen.getByTestId("tax-zoning-preview")).toBeInTheDocument();
    expect(screen.getByTestId("tax-zoning-table")).toBeInTheDocument();
  });
});
