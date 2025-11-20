import Link from "next/link";
import { Service, Stat } from "@/types/service.types";

async function getServices(): Promise<Service[]> {
  return [
    {
      id: 1,
      link: "/propertySearch",
      icon: "🏠",
      title: "Property Tax",
      subtext: "Pay your property taxes online, view assessment details, and download receipts securely.",
      stats: [
        { label: "Total", value: "12,345" },
        { label: "Paid", value: "9,876" },
        { label: "Remaining", value: "2,469" },
      ],
    },
    {
      id: 2,
      link: "/water-tax",
      icon: "💧",
      title: "Water Tax",
      subtext: "Manage water connection bills, track usage, and make payments for water services.",
      stats: [
        { label: "Total", value: "6,500" },
        { label: "Paid", value: "5,200" },
        { label: "Remaining", value: "1,300" },
      ],
    },
    {
      id: 3,
      link: "/bajar-parwana",
      icon: "🛒",
      title: "Bajar Parwana",
      subtext: "Apply for market permits, renew licenses, and manage your commercial establishment permissions.",
      stats: [
        { label: "Total", value: "1,200" },
        { label: "Paid", value: "800" },
        { label: "Remaining", value: "400" },
      ],
    },
    {
      id: 4,
      link: "/birth-death-certificates",
      icon: "📜",
      title: "Birth & Death Certificates",
      subtext: "Apply for and download birth and death certificates with secure verification.",
      stats: [
        { label: "Total", value: "4,000" },
        { label: "Paid", value: "3,200" },
        { label: "Remaining", value: "800" },
      ],
    },
    {
      id: 5,
      link: "/garbage-collection",
      icon: "🗑️",
      title: "Garbage Collection",
      subtext: "Schedule waste pickup, report missed collections, and track garbage collection services.",
      stats: [
        { label: "Total", value: "3,500" },
        { label: "Paid", value: "3,100" },
        { label: "Remaining", value: "400" },
      ],
    },
    {
      id: 6,
      link: "/building-permission",
      icon: "🏗️",
      title: "Building Permission",
      subtext: "Submit building plans, track approval status, and obtain construction permits online.",
      stats: [
        { label: "Total", value: "1,800" },
        { label: "Paid", value: "1,400" },
        { label: "Remaining", value: "400" },
      ],
    },
    {
      id: 7,
      link: "/grievance-redressal",
      icon: "📣",
      title: "Grievance Redressal",
      subtext: "File complaints, track resolution status, and provide feedback on municipal services.",
      stats: [
        { label: "Total", value: "900" },
        { label: "Paid", value: "650" },
        { label: "Remaining", value: "250" },
      ],
    },
    {
      id: 8,
      link: "/rts",
      icon: "⏱️",
      title: "RTS (Right to Services)",
      subtext: "Access guaranteed time-bound services and track application progress under RTS Act.",
      stats: [
        { label: "Total", value: "2,200" },
        { label: "Paid", value: "1,900" },
        { label: "Remaining", value: "300" },
      ],
    },
    {
      id: 9,
      link: "/municipal-assets",
      icon: "🏛️",
      title: "Municipal Assets",
      subtext: "View public assets, infrastructure details, and upcoming development projects.",
      stats: [
        { label: "Total", value: "5,500" },
        { label: "Paid", value: "4,800" },
        { label: "Remaining", value: "700" },
      ],
    },
  ];
}

interface ServiceCardProps {
    link: string;
    icon: string;
    title: string;
    subtext: string;
    stats?: Stat[];
}

const ServiceCard = ({
    link,
    icon,
    title,
    subtext,
    stats
}: ServiceCardProps) => {
    return (
        <Link href={link} className="block group">
            <div className="relative pt-[20px] pr-5 pb-[15px] pl-[15px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 min-h-[130px] flex flex-col justify-end border-l-[8px] border-solid border-[#004c8c]">
                <div className="absolute top-[1px] right-[5px] flex flex-col items-end z-10">
                    {stats?.map((stat) => (
                        <div
                            key={stat.label}
                            className="py-1 px-[5px] rounded-xl text-[12px] text-[#004c8c] whitespace-nowrap font-bold"
                        >
                            {stat.label}: <strong>{stat.value}</strong>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <div className="text-4xl">{icon}</div>
                    <div className="text-lg font-semibold text-gray-800">{title}</div>
                    <p className="text-xs text-gray-500">{subtext}</p>
                </div>
            </div>
        </Link>
    );
};

/**
 * ServiceCards - Server Component
 * Renders a grid of service cards with SSR support
 */
const ServiceCards = async () => {
    const services = await getServices();
    
    // Show empty state if no services
    if (!services || !services.length) {
        return (
            <section className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[250px]">
                <div className="text-center text-gray-500 py-12">
                    No services available
                </div>
            </section>
        );
    }

    return (
        <section className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[250px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
                {services.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                ))}
            </div>
        </section>
    );
};

export default ServiceCards;
