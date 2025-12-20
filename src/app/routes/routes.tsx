import Homepage from "@/pages/Hompage/Homepage";

type Route = {
  path: string;
  element: React.ReactNode;
};

export const ROUTES: Route[] = [
  { 
    path: "/", 
    element: <Homepage />
  },
]