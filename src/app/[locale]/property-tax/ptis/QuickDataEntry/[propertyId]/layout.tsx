import { QuickDataEntryServerLayout } from "@/components/modules/property-tax/ptis/QuickDataEntry/QuickDataEntryServerLayout";

interface Props {
    children: React.ReactNode;
    params: Promise<{ locale: string; propertyId: string }>;
}

export default async function Layout({ children, params }: Props) {

    const { locale, propertyId } = await params;

    return (
        <QuickDataEntryServerLayout
            locale={locale}
            propertyId={propertyId}
        >
            {children}
        </QuickDataEntryServerLayout>
    );
}