import { Graphic, GraphicContainer } from "./GraphicOption.styles";

type GraphicOptionProps = {
  isSelected?: boolean;
  graphicSrc?: string;
  swatchColor?: string;
  label?: string;
  onClick?: () => void;
};

const GraphicOption = ({
  isSelected = false,
  graphicSrc,
  swatchColor,
  label,
  onClick,
}: GraphicOptionProps) => {
  return (
    <GraphicContainer
      type="button"
      isSelected={isSelected}
      onClick={onClick}
      aria-label={label ?? "Graphic Option"}
      title={label}
    >
      <Graphic $swatchColor={swatchColor}>
        {graphicSrc && <img src={graphicSrc} alt={label ?? "Graphic Option"} />}
      </Graphic>
    </GraphicContainer>
  );
};

export default GraphicOption;
