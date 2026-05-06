

import React from "react";
import Link from "next/link";
import { Service, ServiceCardProps } from "@/types/home.types";
import {
    Home,
    Droplet,
    ShoppingCart,
    FileText,
    Trash2,
    Building2,
    Megaphone,
    Timer,
    Landmark
} from "lucide-react";

// Helper to map icon string to component with colors matching the original emoji feel
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'property-tax': return <Home className="w-8 h-8 text-gray-700" />; // House
        case 'water-tax': return <Droplet className="w-8 h-8 text-blue-500 fill-blue-500" />; // Water Drop
        case 'bajar-parwana': return <ShoppingCart className="w-8 h-8 text-orange-600" />; // Cart
        case 'birth-death': return <FileText className="w-8 h-8 text-amber-700" />; // Scroll/Certificate
        case 'garbage-collection': return <Trash2 className="w-8 h-8 text-green-700" />; // Trash
        case 'building-permission': return <Building2 className="w-8 h-8 text-purple-700" />; // Building
        case 'grievance': return <Megaphone className="w-8 h-8 text-red-600" />; // Megaphone
        case 'rts': return <Timer className="w-8 h-8 text-indigo-600" />; // Timer
        case 'assets': return <Landmark className="w-8 h-8 text-teal-700" />; // Bank/Landmark
        default: return <Home className="w-8 h-8 text-gray-700" />;
    }
};


const ServiceCard: React.FC<ServiceCardProps> = ({
    link,
    icon,
    title,
    subtext,
    stats
}) => {
    return (
        <Link href={link} className="block group decoration-0 no-underline">
            <div className="relative p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 min-h-[110px] flex flex-col justify-end border-l-[6px] border-solid border-[#004c8c] hover:scale-[1.02]">
                <div className="absolute top-[1px] right-[5px] flex flex-col items-end z-10">
                    {stats?.map((stat: { label: string; value: string }, index: number) => (
                        <div
                            key={index}
                            className="py-1 px-[5px] rounded-xl text-[12px] text-[#004c8c] whitespace-nowrap font-bold bg-blue-50/50 mb-1"
                        >
                            {stat.label}: <strong>{stat.value}</strong>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <div className="mb-2 group-hover:scale-110 transition-transform duration-300 origin-left">
                        {getIcon(icon)}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 group-hover:text-[#004c8c] transition-colors">{title}</div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtext}</p>
                </div>
            </div>
        </Link>
    );
};

interface ServiceCardsProps {
    services?: Service[];
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ services = [] }) => {
    if (!services || !services.length) return null;

    return (
        <section className="p-4 sm:p-6 max-w-7xl mx-auto min-h-[250px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                ))}
            </div>
        </section>
    );
};

export default ServiceCards;
