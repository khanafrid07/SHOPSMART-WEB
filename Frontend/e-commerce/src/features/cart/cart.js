
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({

    getCart: builder.query({
      query: (params = { count: false }) => {
        const query = new URLSearchParams();
        params?.count && query.append("count", params.count);
        return `/cart/?${query}`;
      },
      providesTags: ["Cart"],
    }),


    addToCart: builder.mutation({
      query: ({ productId, quantity, variantId }) => ({
        url: "/cart/add",
        method: "POST",
        body: { productId, quantity, variantId },
      }),
      invalidatesTags: ["Cart"],
    }),


    updateCartItem: builder.mutation({
      query: ({ productId, variantId, quantity }) => ({
        url: `/cart/update`,
        method: "PUT",
        body: { productId, variantId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: `/cart/remove/${productId}/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
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