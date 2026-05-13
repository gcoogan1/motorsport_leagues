import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';


const NoDrivers = () => {
  const { closeModal } = useModal();
  
  return (
    <Dialog 
      type='alert'
      title='No Drivers Available'
      subtitle="Please add the Driver role to participants, so they can be assigned as drivers in this season."
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default NoDrivers;