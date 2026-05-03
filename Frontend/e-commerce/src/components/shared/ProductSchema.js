import { z } from "zod"


export const variantSchema = z.object({
    attributes: z.record(z.string(), z.string()).refine(
        (attr) => {
            const keys = Object.keys(attr || {});
            return keys.length > 0 && keys.every(k => k.trim() !== "" && attr[k].trim() !== "");
        },
        { message: "At least one valid attribute (e.g., Size: XL) is required for each variant" }
    ),

    price: z.coerce.number().min(1, "Price must be greater than 0"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    discount: z.coerce.number().min(0).max(100).default(0),

    sku: z.string().optional(),

    images: z.array(
        z.object({
            url: z.string().url().optional(),
            fileName: z.string().optional(),
            public_id: z.string().optional(),
        })
    ).default([]),
});
export const productSchema = z.object({
    title: z.string().min(1, "Product title is required"),
    description: z.string().min(1, "Description is required"),


    slug: z.string().min(1, "URL slug is required"),

    category: z.object({
        main: z.string().min(1, "Main category is required"),
        sub: z.string().min(1, "Sub category is required"),
        gender: z.string().min(1, "Gender is required"),
    }),
    tags: z.array(z.string()).optional(),

    images: z.array(
        z.object({
            url: z.string(),
            isMain: z.coerce.boolean().default(false),
            fileName: z.string().optional(),
        })
    ).default([]),
    deleteImages: z.array(z.string()).optional(),

    variants: z.array(variantSchema).min(1, "At least one variant is required").optional(),
    keyFeatures: z.array(z.string().min(1)).default([]).optional(),
    isFeatured: z.boolean().default(false),

}).passthrough();



