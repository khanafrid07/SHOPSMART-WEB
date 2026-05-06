import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:8080/api", prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {

                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        getMyOrders: builder.query({
            query: () => "/orders",
            providesTags: ["orders"]
        }),
        adminGetOrders: builder.query({
            query: () => "/orders/admin",
            providesTags: ["orders"]
        }),
        orderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: ["orders"]
        }),
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: "/orders",
                body: orderData,
                method: "POST"
            }),
            invalidatesTags: ["orders"]
        }),
        updateOrder: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `/orders/${orderId}`,
                body: { status },
                method: "PUT"
            }),
            invalidatesTags: ["orders"]
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["orders"]
        }),
        cancelOrder: builder.mutation({
            query: ({ orderId }) => ({
                url: `/orders/${orderId}/cancel-order`,
                method: "PUT",

            }),
            invalidatesTags: ["orders"]
        }),
        cancelOrderItem: builder.mutation({
            query: ({ orderId, productId, variantId }) => ({
                url: `/orders/${orderId}/items/cancel`,
                method: "PUT",
                body: {
                    productId,
                    variantId,
                },
            }),
            invalidatesTags: ["orders"],
        }),
        getOrderStats: builder.query({
            query: () => "/orders/stats",
            providesTags: ["orders"]
        })

    })

})

export const { useGetOrderStatsQuery, useCreateOrderMutation, useDeleteOrderMutation, useOrderByIdQuery, useUpdateOrderMutation, useCancelOrderMutation, useCancelOrderItemMutation, useAdminGetOrdersQuery, useGetMyOrdersQuery } = orderApi