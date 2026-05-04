import { useEffect, useState } from "react"

export default function ProductImageGallery({ images = [] }) {



    const [mainImg, setMainImg] = useState(images?.[0]?.url)
    useEffect(() => {
        if (images && images.length > 0) {
            setMainImg(images[0].url)
        }
    }, [images])


    return (
        <div>
            <div className="md:grid grid-cols-2 gap-4 px-4 hidden border rounded-sm">
                {images?.map((img, idx) => (
                    <img loading="lazy" key={idx} className="object-cover w-full h-full" src={img?.url} />
                ))}
            </div>
            <div className="md:hidden border rounded-lg shadow-lg space-y-4">
                <div className="h-[22rem] flex items-center justify-center">

                    <img className="object-contain duration-200 h-full transition  transform hover:scale-105 " src={mainImg} alt="mainImg" />
                </div>
                <div className="border-t flex justify-evenly p-2">
                    {images?.map((img, idx) => (
                        <div key={idx} onClick={() => setMainImg(img.url)} className={`border rounded p-2 ${mainImg == img.url ? "border-blue-400 rounded-2xl border-4" : "border-green-100"}`}>
                            <img loading="lazy" className="h-20 w-20 object-cover" src={img.url} />
                        </div>



                    ))}
                </div>
            </div>

        </div>
    )

}