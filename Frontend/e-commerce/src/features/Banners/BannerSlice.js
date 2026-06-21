import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";

export const bannerApi = createApi({
    reducerPath: "bannerApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["banners"],
    endpoints: (builder) => ({
        getBanner: builder.query({
            query: ({ type, category, status } = {}) => {
                let query = "/banners?";

                if (type) query += `type=${type}&`;
                if (category) query += `category=${category}&`;
                if (status) query += `status=${status}&`;

                return { url: query };
            },
            providesTags: ["banners"]
        }),

        getBannerById: builder.query({
            query: (id) => `/banners/${id}`,
            providesTags: (result, error, id) => [{ type: 'banners', id }]
        }),

        createBanner: builder.mutation({
            query: (formData) => ({
                url: "/banners",
                body: formData,
                method: "POST"
            }),
            invalidatesTags: ["banners"]
        }),

        updateBanner: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/banners/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["banners"]
        }),

        updateBannerStatus: builder.mutation({
            query: ({ id, isActive }) => ({
                url: `/banners/${id}/status`,
                method: "PATCH",
                body: { isActive }
            }),
            invalidatesTags: ["banners"]
        }),

        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/api/banners/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["banners"]
        })
    })
})

export const {
    useGetBannerQuery,
    useGetBannerByIdQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useUpdateBannerStatusMutation,
    useDeleteBannerMutation
} = bannerApi