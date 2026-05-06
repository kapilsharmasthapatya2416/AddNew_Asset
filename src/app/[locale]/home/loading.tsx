export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse">
            {/* Banner Skeleton */}
            <div className="w-full h-[180px] sm:h-[250px] md:h-[300px] lg:h-[300px] bg-gray-300"></div>

            {/* Navbar Skeleton */}
            <div className="w-full h-12 bg-gray-300 my-2"></div>

            {/* Service Cards Skeleton */}
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[200px] bg-gray-200 rounded-2xl shadow-sm"></div>
                    ))}
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="w-full h-10 bg-gray-300 mt-auto"></div>
        </div>
    );
}
