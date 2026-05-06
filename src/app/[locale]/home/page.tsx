import { Banner } from "@/components/layout/home/Banner";
import ServiceCards from "@/components/modules/home/ServiceCards";
import { Footer } from "@/components/layout/home/Footer";
import { Navbar } from "@/components/layout/home/Navbar";
import { listServices } from "./action";
import { cookies } from 'next/headers';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const services = await listServices();
    const cookieStore = await cookies();
    const userName = cookieStore.get('user_name')?.value;

    // Get ULB names from cookies
    const ulbName = cookieStore.get('ulb_name')?.value;
    const ulbNameLocal = cookieStore.get('ulb_name_local')?.value;

    // Decide which name to show based on locale
    const displayUlbName = (locale === 'en' || !ulbNameLocal) ? ulbName : ulbNameLocal;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Banner ulbName={displayUlbName} />
            <Navbar username={userName} ulbName={displayUlbName} />
            <ServiceCards services={services} />
            <Footer ulbName={displayUlbName} />
        </div>
    );
}
