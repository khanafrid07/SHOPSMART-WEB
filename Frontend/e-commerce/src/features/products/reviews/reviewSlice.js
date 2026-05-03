import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",

  tagTypes: ["reviews"],

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:8080/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => "/reviews",
      providesTags: ["reviews"],
    }),

    createReviews: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewsMutation,
} = reviewApi;
