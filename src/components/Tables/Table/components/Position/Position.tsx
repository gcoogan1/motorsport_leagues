import { designTokens } from "@app/design/tokens";
import { PositionContainer, PositionText } from "./Position.styles";

type PositionType = "first" | "second" | "third" | "other";
export type PositionBackground = ReturnType<typeof getPositionBackground>;

const getPositionBackground = (positionType: PositionType) => {
  switch (positionType) {
    case "first":
      return {
        background: `${designTokens.gradients.position.goldLeft}`,
        ...designTokens.effects.boxShadow.glowGoldRight,
      };
    case "second":
      return {
        background: `${designTokens.gradients.position.silverLeft}`,
        ...designTokens.effects.boxShadow.glowSilverRight,
      };
    case "third":
      return {
        background: `${designTokens.gradients.position.bronzeLeft}`,
        ...designTokens.effects.boxShadow.glowBronzeRight,
      };
    default:
      return {
        background: "transparent",
        boxShadow: "none",
      };
  }
};

interface PositionProps {
  position: number;
}

const Position= ({ position }: PositionProps) => {
  
  const getPositionType = (position: number) => {
    if (position === 1) return "first";
    if (position === 2) return "second";
    if (position === 3) return "third";
    return "other";
  };

  const positionType = getPositionType(position);
  const positionBackground: PositionBackground = getPositionBackground(positionType);


  return (
    <PositionContainer $positionBackground={positionBackground}>
      <PositionText>{position}</PositionText>
    </PositionContainer>
  );
};

export default Position;