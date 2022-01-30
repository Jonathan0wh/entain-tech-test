import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { NextRaces } from "./types";

// Define a service using a base URL and expected endpoints
export const racingApi = createApi({
  reducerPath: "racingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.neds.com.au/rest/v1/racing/",
  }),
  endpoints: (builder) => ({
    getNextRaces: builder.query<NextRaces, number | void>({
      query: (count = 10) => `?method=nextraces&count=${count}`,
      transformResponse: (rawResult: { status: number; data: NextRaces }) =>
        rawResult.data,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetNextRacesQuery } = racingApi;
