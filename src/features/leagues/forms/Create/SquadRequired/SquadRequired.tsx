import { navigate } from '@/app/navigation/navigation';
import FormBlock from '@/components/Forms/FormBlock/FormBlock'

const SquadRequiredForm = () => {
  const handleOnCancel = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/", { replace: true });
    }
  }

  const handleGoToCreateSquad = () => {
    navigate("/create-squad", { replace: true });
    return
  }

  return (
    <FormBlock 
      title={'Create New League'} 
      question={'Squad Required'}
      helperMessage='To create a League, you need to be a member of a Squad. Continue to create your own Squad.'
      buttons={{
          onCancel: { label: "Cancel", action: handleOnCancel },
          onContinue: {
            label: "Create Squad",
            action: handleGoToCreateSquad,
          },
        }}
      />
  )
}

export default SquadRequiredForm