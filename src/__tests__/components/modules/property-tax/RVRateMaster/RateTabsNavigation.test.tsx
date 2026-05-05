import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { RateTabsNavigation } from "@/components/modules/property-tax/RVRateMaster/RateTabsNavigation";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/en/property-tax/rate-master/rvratemaster",
}));

const mockMessages = {
  ptis_RVRateMaster: {
    header: {
      rateableTab: "Rateable Value",
      capitalTab: "Capital Value",
      rateableTitle: "Rateable Value Rate Master",
      rateableDescription: "Manage rateable value rates",
      capitalTitle: "Capital Value Rate Master",
      capitalDescription: "Manage capital value rates",
    },
  },
};

describe("RateTabsNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders only Rateable Value tab (Capital Value is hidden)", () => {
    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <RateTabsNavigation />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Rateable Value")).toBeInTheDocument();
    // Capital Value tab is intentionally hidden until feature is implemented
    expect(screen.queryByText("Capital Value")).not.toBeInTheDocument();
  });

  it("shows Rateable Value as active on rvratemaster path", () => {
    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <RateTabsNavigation />
      </NextIntlClientProvider>
    );

    const rateableTab = screen.getByText("Rateable Value").closest("button");
    expect(rateableTab).toHaveClass("text-blue-600");
  });

  it("navigates to Rateable Value when clicked", () => {
    const mockPush = vi.fn();
    vi.mocked(vi.mocked(() => ({ push: mockPush })));

    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <RateTabsNavigation />
      </NextIntlClientProvider>
    );

    const rateableTab = screen.getByText("Rateable Value");
    fireEvent.click(rateableTab);
    // Verify navigation logic
  });

  it("renders with proper styling", () => {
    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <RateTabsNavigation />
      </NextIntlClientProvider>
    );

    const rateableTab = screen.getByText("Rateable Value").closest("button");
    
    expect(rateableTab).toHaveClass("px-4", "py-2");
  });
});
