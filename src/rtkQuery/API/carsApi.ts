import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCars } from "@/services/car.service";
import type { CarsTable } from "@/types/cars.types";

export const carsApi = createApi({
  reducerPath: "carsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getCars: builder.query<CarsTable[], void>({
      queryFn: async () => {
        try {
          const cars = await getCars();
          return { data: cars };
        } catch (error) {
          return { error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
    }),
  }),
});

export const {
  useGetCarsQuery,
} = carsApi;