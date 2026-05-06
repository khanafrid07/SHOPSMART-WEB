import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice.js";
import { ProductApi } from '../features/products/productSlice.js';
import { orderApi } from '../features/orders/orderSlice.js';
import { cartApi } from '../features/cart/cart.js';
import { reviewApi } from '../features/products/reviews/reviewSlice.js';
import { bannerApi } from "../features/Banners/BannerSlice.js"
import { dashboardApi } from '../features/Dashboard/dashboardSlice.js';
import { wishlistApi } from '../features/wishlist/wishlistSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,

  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(ProductApi.middleware)
      .concat(orderApi.middleware)
      .concat(cartApi.middleware)
      .concat(reviewApi.middleware)
      .concat(bannerApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(wishlistApi.middleware)

  ),
});
