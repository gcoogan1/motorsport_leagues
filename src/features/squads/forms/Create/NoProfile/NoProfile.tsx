import { navigate } from '@/app/navigation/navigation';
import FormBlock from '@/components/Forms/FormBlock/FormBlock'

const NoProfile = () => {
  const handleOnCancel = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/", { replace: true });
    }
  }

  const handleGoToCreateProfile = () => {
    navigate("/create-profile", { replace: true });
    return
  }

  return (
    <FormBlock 
      title={'Create New Squad'} 
      question={'Profile Required'}
      helperMessage='To create a Squad, you need to have a Profile. Continue to create your first Profile.'
      buttons={{
          onCancel: { label: "Cancel", action: handleOnCancel },
          onContinue: {
            label: "Create Profile",
            action: handleGoToCreateProfile,
          },
        }}
      />
  )
}

export default NoProfile