import type { CheckboxOption } from '../Checkbox/Checkbox'
import CheckboxList from '../CheckboxList/CheckboxList'
import Toggle, { type ToggleOption } from '../Toggle/Toggle'
import { PanelContainer, SecondaryContainer } from './ControlPanel.styles'

type ControlPanelProps = {
  checkboxOptions: CheckboxOption[]
  selectedValues: string[]
  onCheckboxChange: (selectedValues: string[]) => void
  toggle: ToggleOption
}

const ControlPanel = ({
  checkboxOptions,
  selectedValues,
  onCheckboxChange,
  toggle,
}: ControlPanelProps) => {
  return (
    <PanelContainer>
      <CheckboxList
        options={checkboxOptions}
        selectedValues={selectedValues}
        onChange={onCheckboxChange}
      />
      <SecondaryContainer>
        <Toggle {...toggle} />
      </SecondaryContainer>
    </PanelContainer>
  )
}

export default ControlPanel