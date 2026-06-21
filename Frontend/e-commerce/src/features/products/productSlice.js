import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";

export const ProductApi = createApi({
  reducerPath: "productApi",

  baseQuery: baseQueryWithReauth,


  tagTypes: ["Products"],

  endpoints: (builder) => ({

    getProducts: builder.query({
      query: (params = {}) => ({
        url: "/products",
        params,
      }),
      providesTags: (result, error, args) => {
        if (result) {
          return [
            { type: "Products", id: "LIST" },
            ...result.allProducts?.map(({ _id }) => ({ type: "Products", id: _id })) || [],
          ];

        }
        return [{ type: "Products", id: "LIST" }];

      },

    }),

    viewProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),


    addProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),


    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" }
      ],
    }),


    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useViewProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductApi;