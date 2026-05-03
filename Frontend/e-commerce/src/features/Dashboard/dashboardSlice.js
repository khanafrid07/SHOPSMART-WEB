import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:8080/api", prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ["dashboard"],
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => {
                ("API CALLED")
                return "/dashboard/stats"
            },

            providesTags: ["dashboard"]
        }),
    })
})
export const { useGetDashboardStatsQuery } = dashboardApi