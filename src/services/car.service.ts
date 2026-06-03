import { supabase } from "@/lib/supabase";
import type { CarsTable } from "@/types/cars.types";


export const getCars = async (): Promise<CarsTable[]> => {
  const { data, error } = await supabase.from("cars").select("*");

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  return data || [];
};