
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/cart",
    credentials: "include"
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({

    getCart: builder.query({
      query: (params = { count: false }) => {
        const query = new URLSearchParams();
        params?.count && query.append("count", params.count);
        return `/?${query}`;
      },
      providesTags: ["Cart"],
    }),


    addToCart: builder.mutation({
      query: ({ productId, quantity, variantId }) => ({
        url: "/add",
        method: "POST",
        body: { productId, quantity, variantId },
      }),
      invalidatesTags: ["Cart"],
    }),


    updateCartItem: builder.mutation({
      query: ({ productId, variantId, quantity }) => ({
        url: `/update`,
        method: "PUT",
        body: { productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: `/remove/${productId}/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;