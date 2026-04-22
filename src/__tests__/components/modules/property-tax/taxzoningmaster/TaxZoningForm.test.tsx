import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaxZoningForm } from "@/components/modules/property-tax/taxzoningmaster/TaxZoningForm";
import { NextIntlClientProvider } from "next-intl";

describe("TaxZoningForm", () => {
  const mockProps = {
    t: (key: string) => key,
    zone: "",
    setZone: vi.fn(),
    zoneOptions: [{ label: "Zone 1", value: "1" }],
    isTaxZoneValid: true,
    submitted: false,
    ward: [],
    setWard: vi.fn(),
    wardOptions: [{ label: "Ward 1", value: "1" }],
    isWardValid: true,
    fromProps: "",
    setFromProps: vi.fn(),
    toProps: "",
    setToProps: vi.fn(),
    propertyOptionsByWard: [{ label: "001", value: "001" }],
    isPropertyValid: true,
    saving: false,
    isFormValid: true,
    handleSubmit: vi.fn((e) => e.preventDefault()),
    onClear: vi.fn(),
  };

  const renderWithIntl = (component: React.ReactNode) => {
    return render(
      <NextIntlClientProvider locale="en" messages={{}}>
        {component}
      </NextIntlClientProvider>
    );
  };

  it("renders form title and fields", () => {
    renderWithIntl(<TaxZoningForm {...mockProps} />);
    
    expect(screen.getAllByText(/form\.update/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/form\.taxZone/i)).toBeInTheDocument();
    expect(screen.getByText(/form\.ward/i)).toBeInTheDocument();
  });

  it("calls handleSubmit on form submission", () => {
    renderWithIntl(<TaxZoningForm {...mockProps} />);
    const updateBtn = screen.getAllByRole("button").find(btn => btn.textContent?.includes("form.update"));
    const form = updateBtn?.closest("form");
    if (form) {
      fireEvent.submit(form);
    }
    expect(mockProps.handleSubmit).toHaveBeenCalled();
  });

  it("calls onClear when clear button is clicked", () => {
    renderWithIntl(<TaxZoningForm {...mockProps} />);
    const clearBtn = screen.getByText(/form\.clearImported/i);
    fireEvent.click(clearBtn);
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it("disables save button when saving", () => {
    renderWithIntl(<TaxZoningForm {...mockProps} saving={true} />);
    const saveBtn = screen.getAllByRole("button").find(btn => btn.textContent?.includes("form.updating"));
    expect(saveBtn).toBeDisabled();
  });

  it("shows validation message when submitted and invalid", () => {
    renderWithIntl(<TaxZoningForm {...mockProps} submitted={true} isTaxZoneValid={false} />);
    expect(screen.getByText(/messages\.taxZoneRequired/i)).toBeInTheDocument();
  });
});
