import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Toaster } from "@/components/common/sonner";

describe("Toaster", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container.firstChild).toBeInTheDocument();
  });


  it.skip("applies custom className and style", () => {

  });
});