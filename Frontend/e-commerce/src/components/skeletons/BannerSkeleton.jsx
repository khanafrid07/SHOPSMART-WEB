export default function BannerSkeleton() {
    return (
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] bg-gray-200 animate-pulse rounded-2xl overflow-hidden">
            <div className="absolute top-1/2 left-20 space-y-3">
                <div className="h-4 w-72 bg-gray-300 rounded" />
                <div className="h-6 w-96 bg-gray-300 rounded" />
                <div className="h-10 w-32 bg-gray-300 rounded-full" />
            </div>
        </div>
    );
}