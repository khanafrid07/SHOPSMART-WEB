import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQueryWithReauth";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["dashboard"],
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => {
                return "/dashboard/stats"
            },

            providesTags: ["dashboard"]
        }),
    })
})
export const { useGetDashboardStatsQuery } = dashboardApi