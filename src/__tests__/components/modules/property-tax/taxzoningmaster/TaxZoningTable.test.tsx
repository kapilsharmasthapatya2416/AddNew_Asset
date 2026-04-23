import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaxZoningTable } from "@/components/modules/property-tax/taxzoningmaster/TaxZoningTable";
import { NextIntlClientProvider } from "next-intl";

import commonMessages from "@/i18n/locales/en/common.json";
import taxzoningMessages from "@/i18n/locales/en/taxzoning.json";

const messages = {
  common: commonMessages,
  taxzoning: taxzoningMessages,
};

describe("TaxZoningTable", () => {
  const mockProps = {
    t: (key: string) => key,
    columns: [],
    tableRecords: [],
    currentPage: 1,
    pageSizes: "10",
    totalCount: 0,
    totalPages: 0,
    loading: false,
    changePage: vi.fn(),
    changePageSize: vi.fn(),
    pageSizeOptions: [5, 10, 20],
    hasImportedData: false,
    saving: false,
    handleBulkUpdate: vi.fn(),
    handleClearImported: vi.fn(),
    handleImportFile: vi.fn(),
    handleExportCSV: vi.fn(),
    fileInputRef: { current: null } as unknown as React.RefObject<HTMLInputElement | null>,
  };

  const renderWithIntl = (component: React.ReactNode) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    );
  };

  it("renders table title and action buttons", () => {
    renderWithIntl(<TaxZoningTable {...mockProps} />);
    
    expect(screen.getByText(/table\.zoningRecords/i)).toBeInTheDocument();
    expect(screen.getAllByText(/form\.bulkUpdate/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/buttons\.importFile/i)).toBeInTheDocument();
    expect(screen.getByText(/buttons\.exportCSV/i)).toBeInTheDocument();
  });

  it("calls handleExportCSV when export button is clicked", () => {
    renderWithIntl(<TaxZoningTable {...mockProps} />);
    const exportBtn = screen.getByText(/buttons\.exportCSV/i);
    fireEvent.click(exportBtn);
    expect(mockProps.handleExportCSV).toHaveBeenCalled();
  });

  it("calls handleBulkUpdate when bulk update button is clicked", () => {
    renderWithIntl(<TaxZoningTable {...mockProps} hasImportedData={true} />);
    const bulkUpdateBtn = screen.getAllByRole("button").find(btn => btn.textContent?.includes("form.bulkUpdate"));
    if (bulkUpdateBtn) {
      fireEvent.click(bulkUpdateBtn);
    }
    expect(mockProps.handleBulkUpdate).toHaveBeenCalled();
  });

  it("disables bulk update button when no imported data", () => {
    renderWithIntl(<TaxZoningTable {...mockProps} hasImportedData={false} />);
    const bulkUpdateBtn = screen.getAllByRole("button").find(btn => btn.textContent?.includes("form.bulkUpdate"));
    expect(bulkUpdateBtn).toBeDisabled();
  });

  it("shows clear imported button when data is imported", () => {
    renderWithIntl(<TaxZoningTable {...mockProps} hasImportedData={true} />);
    expect(screen.getByText(/form\.clearImported/i)).toBeInTheDocument();
  });
});
