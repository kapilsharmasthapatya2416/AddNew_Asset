import { QuickDataEntryServerLayout } from "@/components/modules/property-tax/ptis/QuickDataEntry/QuickDataEntryServerLayout";

interface Props {
    children: React.ReactNode;
    params: Promise<{ locale: string; propertyId: string }>;
}

export default async function Layout({ children }: Props) {

    // const { locale, propertyId } = await params;

    return (
        <QuickDataEntryServerLayout>
            {children}
        </QuickDataEntryServerLayout>
    );
}