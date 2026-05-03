import { useForm } from "react-hook-form"
import { productSchema } from "../components/shared/ProductSchema";
export default function useProductForm() {

    return useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            basePrice: "",
            slug: "",
            stock: 0,
            category: {
                main: "",
                sub: "",
                gender: "",
            },
            keyFeatures: [""],
            isFeatured: false,
            isActive: true,
            tags: [""]
        },
    });


}