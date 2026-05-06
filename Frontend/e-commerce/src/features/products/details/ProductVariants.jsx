import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
export default function ProductVariants({ images, info, selectedVariant, setSelectedVariant, allVariant }) {

    const [manualVariantSelection, setManualVariantSelection] = useState({})
    const [variantMatch, setVariantMatch] = useState(false)
    const attributesKey = useMemo(() => {
        const map = {};

        allVariant?.forEach((variant) => {
            Object.entries(variant.attributes || {}).forEach(([key, value]) => {
                if (!map[key]) map[key] = [];
                if (!map[key].includes(value)) map[key].push(value);
            });
        });

        return map;
    }, [allVariant]);
    useEffect(() => {
        setManualVariantSelection((prev) => {
            const updated = { ...prev };

            Object.keys(attributesKey).forEach((key) => {
                if (attributesKey[key].length === 1 && !updated[key]) {
                    updated[key] = attributesKey[key][0];
                }
            });

            return updated;
        });
    }, [attributesKey]);
    const matchVariant = useMemo(() => {
        return allVariant?.find((variant) => {
            return Object.entries(manualVariantSelection).every(([key, value]) => {
                return variant.attributes?.[key] === value;
            });
        });
    }, [manualVariantSelection, allVariant]);

    useEffect(() => {
        if (matchVariant) {
            setSelectedVariant(matchVariant);
            setVariantMatch(true)
        } else {
            setVariantMatch(false)
        }
    }, [matchVariant, setSelectedVariant]);


    const handleVariantSelect = (key, value) => {
        setManualVariantSelection((prev) => {

            let newSelection = { ...prev, [key]: value };


            Object.keys(newSelection).forEach((k) => {
                if (k === key) return;

                const isStillValid = allVariant.some((variant) => {
                    return Object.entries(newSelection).every(([kk, vv]) => {
                        return variant.attributes?.[kk] === vv;
                    });
                });


                if (!isStillValid) {
                    delete newSelection[k];
                }
            });

            return newSelection;
        });
    };



    const getAvailableOption = (key, value) => {
        return allVariant.some((variant) => {
            return Object.entries(manualVariantSelection).every(([k, v]) => {
                if (k === key) return true;
                return variant.attributes?.[k] === v;
            }) && variant.attributes?.[key] === value;
        });
    };


    return (
        <div className="p-4">
            <h2 className="font-bold text-2xl">Available Variants</h2>
            {!variantMatch && <p className="text-red-500">Please Select Matching Variants</p>}
            {Object.keys(attributesKey).map((key, idx) => (
                <div key={idx} className="flex gap-4 items-center mt-1">
                    <p className="font-bold">{key}:</p>

                    {attributesKey[key].map((value, idx) => {
                        const isAvailable = getAvailableOption(key, value)


                        return <div key={idx}>
                            <button onClick={() => handleVariantSelect(key, value)} className={`btn rounded ${!isAvailable && "line-through"} ${manualVariantSelection[key] === value ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white" : `${selectedVariant?.attributes?.[key] === value ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white" : ""}`} text-black`} >{value}</button>

                        </div>
                    })}
                </div>
            ))}


        </div>
    );
}