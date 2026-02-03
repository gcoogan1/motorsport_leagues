import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { type AppDispatch } from "@/store";
import { updateProfileDraft } from "@/store/profile/profile.slice";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import { withMinDelay } from "@/utils/withMinDelay";
import SelectBoxInput from "@/components/Inputs/SelectBoxInput/SelectBoxInput";
import { gameOptions } from "./Game.variants";
import { gameSchema, type GameValues } from "./gameSchema";

//TODO: MAYBE GO BACK TO PROFILE WHEN COMPLETED? 

type GameProps = {
  onSuccess?: () => void; 
};

const Game = ({ onSuccess }: GameProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>("gt7");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  //  - Form setup -- //
  const formMethods = useForm<GameValues>({
    resolver: zodResolver(gameSchema),
  });

  const { handleSubmit } = formMethods;

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleOnSubmit = async (data: GameValues) => {
    setIsLoading(true);
    await withMinDelay(
      (async () => {
        // Update draft in Redux store
        dispatch(updateProfileDraft({ gameType: data.game }));

        // Call onSuccess callback if provided
        onSuccess?.();
      })(),
      1000,
    );
    setIsLoading(false);
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title="Create New Profile"
        question="What game is this Profile for?"
        helperMessage="Each driver’s Profile can only be linked to one game."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Close", action: handleGoBack },
          onContinue: {
            label: "Continue",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <SelectBoxInput
          name="game"
          options={gameOptions}
          value={selectedGame}
          onChange={setSelectedGame}
          defaultSelected={selectedGame}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default Game;
