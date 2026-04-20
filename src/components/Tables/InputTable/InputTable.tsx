export { default as ResultTable } from "./variants/ResultTable";
export { default as ParticipantTable } from "./variants/ParticipantTable";
export { default as CarTable } from "./variants/CarTable";

/* Example of how to use the tables:

  import { ResultTable } from "@/components/Tables/InputTable";
  import { FormProvider, useForm } from "react-hook-form";

  const methods = useForm({
    defaultValues: {
      results: [
        { driver: "", time: "", points: "" },
        { driver: "", time: "", points: "" },
        { driver: "", time: "", points: "" },
      ],
    
  });

  <FormProvider {...methods}>
    <ResultTable
      name="results"
      columns={{
        p: { id: "p", name: "p", value: "P" },
        driver: { id: "driver", name: "driver", label: "Driver", profiles: mockProfiles },
        time: { id: "time", name: "time", value: "Time" },
        points: { id: "points", name: "points", value: "Pts" },
    }}
  />
  </FormProvider> 

  */
