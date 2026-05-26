import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type NoDriversProps = {
  preQual?: boolean;
  driverGrid?: boolean;
}

const NoDrivers = ({ preQual, driverGrid }: NoDriversProps) => {
  const { closeModal } = useModal();

  const subtitle = preQual
    ? "Please assign Drivers to Pre-Qualifying, so they can be added as competitors in this division."
    : driverGrid
    ? "Please assign a Driver to this division lineup."
    : "Please add the Driver role to participants, so they can be assigned as drivers in this season.";
  
  return (
    <Dialog 
      type='alert'
      title='No Drivers Available'
      subtitle={subtitle}
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