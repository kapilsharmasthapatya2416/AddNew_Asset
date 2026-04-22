import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTaxZoningActions } from "@/hooks/useTaxZoningActions";
import { updateTaxZoningAction } from "@/app/[locale]/property-tax/taxzoning/actions";
import { ZoningRecord, Ward, PreviewRow } from "@/types/taxzoning.types";
import { PagedResponse } from "@/types/common.types";
import { toast } from "sonner";

vi.mock("@/app/[locale]/property-tax/taxzoning/actions", () => ({
  updateTaxZoningAction: vi.fn(),
  createTaxZoningAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("useTaxZoningActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const t = (key: string) => key;
  const mockWards = { items: [{ wardId: 1, wardNo: "W1" }] } as unknown as PagedResponse<Ward>;

  it("handles single ward update success", async () => {
    (updateTaxZoningAction as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true, message: "Updated" });
    const { result } = renderHook(() => useTaxZoningActions(t));

    const records = [{ wardId: 1, wardNo: "W1" }] as unknown as ZoningRecord[];
    const previewData = [{ propertyNo: "001" }, { propertyNo: "010" }] as unknown as PreviewRow[];
    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.handleUpdate({
        zone: "1",
        ward: ["1"],
        previewData,
        records,
        wardsData: mockWards,
        onSuccess,
      });
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Updated");
  });

  it("handles bulk update error", async () => {
    (updateTaxZoningAction as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Fail"));
    const { result } = renderHook(() => useTaxZoningActions(t));

    const changes = [{ taxZoneId: 1, wardId: 1, fromProperty: "001", toProperty: "010", status: "Updated" }] as unknown as ZoningRecord[];

    await act(async () => {
      await result.current.handleBulkUpdate(changes, vi.fn());
    });

    expect(toast.error).toHaveBeenCalledWith("messages.noRecordsProcessed");
  });
});
