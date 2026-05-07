
'use client';

import React, { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Service, ServiceCardProps } from "@/types/home/home.types";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/common/Badge";
import { HOME_SERVICE_ICONS, DEFAULT_SERVICE_ICON, MODULE_ICON_MAP } from "@/config/home-services.config";

/**
 * Gets the icon component for a given icon name
 * Uses centralized config for consistency and maintainability
 */
const getIcon = (iconName: string) => {
    // Find the module code from the icon name
    const moduleCode = Object.entries(MODULE_ICON_MAP).find(
        ([, name]) => name === iconName
    )?.[0];
    
    const config = moduleCode 
        ? HOME_SERVICE_ICONS[moduleCode] || DEFAULT_SERVICE_ICON 
        : DEFAULT_SERVICE_ICON;
    
    const IconComponent = config.icon;
    return <IconComponent className={config.className} aria-hidden="true" />;
};


const ServiceCard: React.FC<ServiceCardProps> = ({
    link,
    icon,
    title,
    subtext,
    stats
}) => {
    return (
        <Link 
            href={link} 
            className="block group decoration-0 no-underline h-full"
            aria-label={`Navigate to ${title}`}
        >
            <article className={cn(
                "relative p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 min-h-[180px]",
                "flex flex-col justify-between border-l-[6px] border-solid border-[#004c8c] hover:scale-[1.02] h-full"
            )}>
                <div className="absolute top-2 right-3 flex flex-col items-end z-10 gap-1" aria-label="Statistics">
                    {stats?.map((stat: { label: string; value: string }, index: number) => (
                        <Badge 
                            key={index}
                            variant="secondary"
                            size="sm"
                            className="bg-blue-50/50 text-[#004c8c] border-blue-100 font-bold"
                        >
                            {stat.label}: {stat.value}
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-col h-full pt-2">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">
                        {getIcon(icon)}
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#004c8c] transition-colors leading-tight">{title}</h3>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{subtext}</p>
                    </div>
                </div>
            </article>
        </Link>
    );
};

interface ServiceCardsProps {
    services?: Service[];
    /** Error message to display as toast notification */
    error?: string;
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ services = [], error }) => {
    // Show toast notification if there's an API error
    useEffect(() => {
        if (error) {
            toast.error(error, {
                duration: 5000,
                id: 'services-load-error', // Prevent duplicate toasts
            });
        }
    }, [error]);

    if (!services || !services.length) return null;

    return (
        <section className="w-full p-4 sm:p-8 md:p-12 min-h-[400px]" aria-label="Available Services">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
                {services.map(({ id, ...rest }) => (
                    <ServiceCard key={id} {...rest} />
                ))}
            </div>
        </section>
    );
};

export default ServiceCards;
