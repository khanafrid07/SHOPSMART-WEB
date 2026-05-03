export default function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 animate-pulse h-full">

            <div className="grid grid-cols-2 gap-4 hidden md:grid  ">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-300 h-40 md:h-[22rem]"
                    ></div>
                ))}
            </div>
            <div className="md:hidden flex justify-center items-center ">
                <div className="bg-gray-300 h-[22rem] w-[17rem]"></div>
            </div>

            <div className="flex flex-col gap-4">

                {/* Title */}
                <div className="bg-gray-300 h-8 w-3/4 rounded-md"></div>

                {/* Price */}
                <div className="bg-gray-300 h-6 w-1/3 rounded-md"></div>

                {/* Rating */}
                <div className="bg-gray-300 h-5 w-1/4 rounded-md"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="bg-gray-300 h-4 w-full rounded"></div>
                    <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
                    <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
                </div>


                <div className="flex gap-2 mt-2">
                    <div className="bg-gray-300 h-10 w-16 rounded-lg"></div>
                    <div className="bg-gray-300 h-10 w-16 rounded-lg"></div>
                    <div className="bg-gray-300 h-10 w-16 rounded-lg"></div>
                </div>


                <div className="flex gap-4 mt-4">
                    <div className="bg-gray-300 h-12 w-1/2 rounded-lg"></div>
                    <div className="bg-gray-300 h-12 w-1/2 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}