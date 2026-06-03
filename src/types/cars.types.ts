export type CarCategory =
  | "stock"
  | "gr.n"
  | "gr.4"
  | "gr.3"
  | "gr.2"
  | "gr.1"
  | "gr.b"
  | "gr.x";

  export type CarsTable = {
    id: string;
    car_category: CarCategory;
    car_name: string;
    car_image_url: string;
    manufacturer?: string;
  };