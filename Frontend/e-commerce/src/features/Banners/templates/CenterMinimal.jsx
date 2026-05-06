export default function CenterMinimal({ banner, rounded }) {
  return (
    <div className={`relative h-[55vh] md:h-[75vh] w-full flex items-center justify-center ${rounded ? "rounded-xl" : "rounded-none"} overflow-hidden`}>

      <img
        src={banner.image.url}
        className="absolute w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative text-center text-white">

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white/70 mb-4 shadow-sm ">
          {banner.title}
        </h2>
        <p className="mt-2 font-semibold text-gray-200">{banner.heading}</p>

        <p className="mt-2">{banner.subHeading}</p>

        <a className="mt-4 inline-block px-5 py-2 bg-white text-black rounded-lg">
          {banner.ctaText}
        </a>

      </div>
    </div>
  );
}