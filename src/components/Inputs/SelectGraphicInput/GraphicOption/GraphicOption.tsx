import { Graphic, GraphicContainer } from "./GraphicOption.styles";

type GraphicOptionProps = {
  isSelected?: boolean;
  graphicSrc: string;
  onClick?: () => void;
};

const GraphicOption = ({
  isSelected = false,
  graphicSrc,
  onClick,
}: GraphicOptionProps) => {
  return (
    <GraphicContainer isSelected={isSelected} onClick={onClick}>
      <Graphic src={graphicSrc} alt="Graphic Option" />
    </GraphicContainer>
  );
};

export default GraphicOption;
