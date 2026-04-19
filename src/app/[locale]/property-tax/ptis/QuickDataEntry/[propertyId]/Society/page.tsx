import { setRequestLocale } from 'next-intl/server';
import SocietyForm from "@/components/modules/property-tax/ptis/QuickDataEntry/society/SocietyForm"

import { getPropertySocietyDetailsAction } from './action';

interface PageProps {
    params: Promise<{
        propertyId: string;
        locale: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SocietyFormPage({ params }: PageProps) {
    const { locale, propertyId } = await params;
    setRequestLocale(locale);

    const propertySocietyDetails = await getPropertySocietyDetailsAction(Number(propertyId));

    return (
        <SocietyForm
            societyData={propertySocietyDetails}
            propertyIdSearch={Number(propertyId)}
            locale={locale}
        />
    )
}