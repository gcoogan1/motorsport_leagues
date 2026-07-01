import { navigate } from "@/app/navigation/navigation";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react"
import FormBlock from "@/components/Forms/FormBlock/FormBlock";

const EmptyCreate = () => {
  return (
    <FormBlock
      title={"Create New League"}
      question="Coming Soon"
      helperMessage="You can create your very own league after the VIP GT World Championship’s grand final wraps up on 26 Sep 2026."
      buttons={{
        onContinue: {
          label: "Back to Homepage",
          action: () => {
            navigate("/");
          },
          rightIcon: <ArrowForward />,
        },
      }}
    />
  );
};

export default EmptyCreate;
