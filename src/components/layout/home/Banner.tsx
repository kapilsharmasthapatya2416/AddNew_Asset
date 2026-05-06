import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";

interface BannerProps {
    ulbName?: string;
}

export const Banner = ({ ulbName }: BannerProps) => {
    const t = useTranslations('common');
    const displayUlbName = ulbName || t('app.defaultUlbName');

    return (
        <div className="w-full">
            {/* Banner image */}
            <div className="relative w-full bg-gradient-to-r from-blue-900 to-teal-700 h-[170px] sm:h-[230px] md:h-[280px] lg:h-[280px]">
                <div className="absolute inset-0">
                    <Image
                        src="/images/home_thane.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover"
                        fill
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Banner heading */}
                <div className="relative z-10 flex items-center justify-center h-full">
                    <h1 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center drop-shadow-md">
                        {displayUlbName}
                    </h1>
                </div>
            </div>
        </div>
    );
};
