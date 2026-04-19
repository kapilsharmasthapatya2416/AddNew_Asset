
import QuickDataEntryLayout from "@/components/modules/property-tax/ptis/QuickDataEntry/QuickDataEntryLayout";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <QuickDataEntryLayout>
                {children}
            </QuickDataEntryLayout>
        </Suspense>
    );
}
