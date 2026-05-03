import { z } from "zod"

export const reviewSchema = z.object({
    productId: z.string().min(1, { message: "Product ID is required" }),
    rating: z.number().min(1, { message: "Rating must be at least 1" }).max(5, { message: "Rating must be at most 5" }),
    comment: z.string().min(5, { message: "Comment must be at least 5 characters long" }),

})



