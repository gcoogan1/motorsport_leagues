import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";


const { gradients, colors, layout, borders } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 640px;
  padding: ${layout.space.xxLarge} ${layout.space.xLarge};
  justify-content: center;
  align-items: center;
  background: ${colors.base.base2};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })};
`;