import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";


export const wishlistApi = createApi({
    reducerPath: "wishlistApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Wishlist"],

    endpoints: (builder) => ({
        addToWishlist: builder.mutation({
            query: ({ productId, variantId }) => ({
                url: "/wishlist/add",
                method: "POST",
                body: { productId, variantId },
            }),
            invalidatesTags: ["Wishlist"]
        }),
        getWishlist: builder.query({
            query: () => "/wishlist/get-wishlist",
            providesTags: ["Wishlist"]
        }),
        removeFromWishlist: builder.mutation({
            query: ({ id, variantId }) => ({
                url: `/wishlist/remove/${id}/${variantId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Wishlist"]
        }),
    }),


})

export const { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } = wishlistApi