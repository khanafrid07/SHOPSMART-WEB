import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bannerApi = createApi({
    reducerPath: "bannerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:8080/api", prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
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
                url: `/banners/${id}`,
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