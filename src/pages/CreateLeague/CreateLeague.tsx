import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";
import { selectHasProfiles } from "@/store/profile/profile.selectors";
import { selectHasSquads } from "@/store/squads/squad.selectors";
import { clearLeagueDraft } from "@/store/leagues/league.slice";
import LoadingScreen from "@/components/Messages/LoadingScreen/LoadingScreen";
import { PageWrapper } from "./CreateLeague.styles";
import ProfileRequiredForm from "@/features/leagues/forms/Create/ProfileRequired/ProfileRequired";
import SquadRequiredForm from "@/features/leagues/forms/Create/SquadRequired/SquadRequired";
import Director from "@/features/leagues/forms/Create/Director/Director";
import Host from "@/features/leagues/forms/Create/Host/Host";
import CoverForm from "@/features/leagues/forms/Create/Cover/CoverForm";
import Season from "@/features/leagues/forms/Create/Season/Season";



const CreateLeague = () => {
  const [step, setStep] = useState<"director" | "host" | "cover" | "season">("director");
  const dispatch = useDispatch<AppDispatch>();
  const hasProfiles = useSelector(selectHasProfiles);
  const hasSquads = useSelector(selectHasSquads);
  const isLoadingRequirements = hasProfiles === null || hasSquads === null;

  // Clear any existing draft on mount
  useEffect(() => {
    dispatch(clearLeagueDraft());
  }, [dispatch]);

  const handleNextStep = () => {
    if (step === "director") {
      setStep("host");
    }
    if (step === "host") {
      setStep("cover");
    }
    if (step === "cover") {
      setStep("season");
    }
  };

  const handlePreviousStep = () => {
    if (step === "host") {
      setStep("director");
    }
    if (step === "cover") {
      setStep("host");
    }
    if (step === "season") {
      setStep("cover");
    }
  };

  if (isLoadingRequirements) {
    return <LoadingScreen />;
  }
  
  return (
    <PageWrapper>
      {!hasProfiles ? (
        <ProfileRequiredForm />
      ) : !hasSquads ? (
        <SquadRequiredForm />
      ) : (
        <>
          {step === "director" && <Director onSuccess={handleNextStep} />}
          {step === "host" && <Host onSuccess={handleNextStep} onBack={handlePreviousStep} />}
          {step === "cover" && <CoverForm onSuccess={handleNextStep} onBack={handlePreviousStep} />}
          {step === "season" && <Season onBack={handlePreviousStep} />}
        </>
      )}
    </PageWrapper>
  )
}

export default CreateLeague