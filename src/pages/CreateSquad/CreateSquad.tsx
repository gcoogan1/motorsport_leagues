import { useEffect, useState } from 'react';
import { PageWrapper } from './CreateSquad.styles'
import { type AppDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectHasProfiles } from '@/store/profile/profile.selectors';
import { clearSquadDraft } from '@/store/squads/squad.slice';
import NoProfileForm from '@/features/squads/forms/Create/NoProfile/NoProfileForm';
import Founder from '@/features/squads/forms/Create/Founder/Founder';
import Name from '@/features/squads/forms/Create/Name/Name';
import Banner from '@/features/squads/forms/Create/Banner/Banner';

const CreateSquad = () => {
  const [step, setStep] = useState<"founder" | "name" | "banner">("founder");
  const dispatch = useDispatch<AppDispatch>();
  const hasProfiles = useSelector(selectHasProfiles);

  // Clear any existing draft on mount
  useEffect(() => {
    dispatch(clearSquadDraft());
  }, [dispatch]);

    const handleNextStep = () => {
    if (step === "founder") {
      setStep("name");
    }
    if (step === "name") {
      setStep("banner");
    }
  };

  const handlePreviousStep = () => {
    if (step === "name") {
      setStep("founder");
    }
    if (step === "banner") {
      setStep("name");
    }
  };

  return (
    <PageWrapper>
      {!hasProfiles ? (
        <NoProfileForm />
      ) : (
        <>
          {step === "founder" && <Founder onSuccess={handleNextStep} />}
          {step === "name" && <Name onSuccess={handleNextStep} onBack={handlePreviousStep} />}
          {step === "banner" && <Banner onBack={handlePreviousStep} />}
        </>
      )}
    </PageWrapper>
  )
}

export default CreateSquad