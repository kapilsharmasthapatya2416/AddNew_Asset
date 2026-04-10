import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import PropertyFormPage from './[propertyId]/Property/page';
import { redirect } from 'next/navigation';

interface QuickDataEntryPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        propertyId?: string;
        wardNo?: string;
        propertyNo?: string;
        partitionNo?: string;
    }>;
}

// ✅ Safe Number Parsing for FormData and Parameters
const parseSafeNumber = (val: any) => {
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
};

export async function closeDrawer(formData: FormData) {
    const locale = formData.get('locale') as string;
    const wardNo = formData.get('wardNo') as string;
    const propertyNo = formData.get('propertyNo') as string;
    const partitionNo = formData.get('partitionNo') as string;
    const propertyId = formData.get('propertyId') as string;

    const query = new URLSearchParams();
    if (wardNo) query.set('wardNo', wardNo);
    if (propertyNo) query.set('propertyNo', propertyNo);
    if (partitionNo) query.set('partitionNo', partitionNo);
    if (propertyId) query.set('propertyId', propertyId);

    const queryString = query.toString();
    redirect(`/${locale}/property-tax/ptis?${queryString}`);
}

export const dynamic = 'force-dynamic';

export default async function QuickDataEntryPage({ params, searchParams }: QuickDataEntryPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <Suspense fallback={<div className="p-10 text-center font-bold text-blue-600 animate-pulse">Loading Module Content...</div>}>
            <PropertyFormPage
                params={params as unknown as Promise<{ propertyId: string; locale: string; }>}
                searchParams={searchParams as unknown as Promise<{ [key: string]: string | string[] | undefined; }>}
            />
        </Suspense>
    );
}
