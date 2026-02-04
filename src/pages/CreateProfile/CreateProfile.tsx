import { useEffect, useState } from 'react';
import Game from '@/features/profiles/forms/Create/Game/Game'
import Username from '@/features/profiles/forms/Create/Username/Username';
import { PageWrapper } from './CreateProfile.styles'
import AvatarForm from '@/features/profiles/forms/Create/Avatar/AvatarForm';
import type { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { clearProfileDraft } from '@/store/profile/profile.slice';

const CreateProfile = () => {
  const [step, setStep] = useState<"game" | "username" | "avatar">("game");
  const dispatch = useDispatch<AppDispatch>();

  // Clear any existing draft on mount
  useEffect(() => {
    dispatch(clearProfileDraft());
  }, [dispatch]);

  

  const handleNextStep = () => {
    if (step === "game") {
      setStep("username");
    }
    if (step === "username") {
      setStep("avatar");
    }
  };
  
  const handlePreviousStep = () => {
    if (step === "username") {
      setStep("game");
    }
    if (step === "avatar") {
      setStep("username");
    }
  };

  return (
    <PageWrapper>
      {step === "game" && <Game onSuccess={handleNextStep} />}
      {step === "username" && <Username onSuccess={handleNextStep} onBack={handlePreviousStep} />}
      {step === "avatar" && <AvatarForm onBack={handlePreviousStep} />}
    </PageWrapper>
  )
}

export default CreateProfile