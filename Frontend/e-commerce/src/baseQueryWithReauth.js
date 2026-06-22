import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080/api",
  credentials: 'include',
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Successfully refreshed, retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, you might want to log the user out here
      // api.dispatch(logout());
    }
  }
  return result;
};
