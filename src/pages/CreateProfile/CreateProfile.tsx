import { useState } from 'react';
import Game from '@/features/profiles/forms/Create/Game/Game'
import Username from '@/features/profiles/forms/Create/Username/Username';
import { PageWrapper } from './CreateProfile.styles'

const CreateProfile = () => {
  const [step, setStep] = useState<"game" | "username">("game");

  const handleNextStep = () => {
    if (step === "game") {
      setStep("username");
    }
    console.log("Next step called", step)
  };
  
  const handlePreviousStep = () => {
    if (step === "username") {
      setStep("game");
    }
  };

  return (
    <PageWrapper>
      {step === "game" && <Game onSuccess={handleNextStep} />}
      {step === "username" && <Username onSuccess={() => {}} onBack={handlePreviousStep} />}
    </PageWrapper>
  )
}

export default CreateProfile