import { FormProvider, useForm } from "react-hook-form";

export const FormProviderMock = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};
