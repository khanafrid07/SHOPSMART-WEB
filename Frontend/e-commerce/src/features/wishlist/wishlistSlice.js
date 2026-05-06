import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const wishlistApi = createApi({
    reducerPath: "wishlistApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/wishlist`, prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ["Wishlist"],

    endpoints: (builder) => ({
        addToWishlist: builder.mutation({
            query: ({ productId, variantId }) => ({
                url: "/add",
                method: "POST",
                body: { productId, variantId },
            }),
            invalidatesTags: ["Wishlist"]
        }),
        getWishlist: builder.query({
            query: () => "/get-wishlist",
            providesTags: ["Wishlist"]
        }),
        removeFromWishlist: builder.mutation({
            query: ({ id, variantId }) => ({
                url: `/remove/${id}/${variantId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Wishlist"]
        }),
    }),


})

export const { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } = wishlistApi