"use client";

import ConfirmProvider from "@/components/common/ConfirmProvider";
import { Toaster } from "sonner";
// import { ConfirmProvider } from "@/components/common/ConfirmProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmProvider>
      <Toaster position="top-right" richColors closeButton />
      {children}
    </ConfirmProvider>
  );
}
