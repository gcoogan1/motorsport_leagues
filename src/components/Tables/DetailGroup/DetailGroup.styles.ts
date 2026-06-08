import styled from "styled-components";
import { designTokens } from "@app/design/tokens";
import { gradientBorder } from "@/app/design/mixens/gradientBorder";

const { colors, gradients, layout, borders, typography } = designTokens;


export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  width: 100%;
  min-width: 240px;
  border-radius: ${layout.space.medium};
  padding: ${layout.space.medium};
  background: ${colors.base.translucent10};
`;

export const DetailSetting = styled.p`
  ${typography.body.mediumRegular}
  color: ${colors.text.text2};
`;

export const DetailOption = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text1};
`;

export const GroupContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 264px;
  max-width: 640px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: ${layout.space.xLarge};

  ${gradientBorder({
    gradient: gradients.base.fadeBottom10,
    width: borders.width.medium,
  })}
`;

export const Header = styled.div`
  display: flex;
  padding: ${layout.space.medium};
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-bottom: ${borders.width.medium} solid ${colors.base.translucent10};
`;

export const HeaderTitle = styled.h2`
  ${typography.subtitle.medium};
  color: ${colors.text.text2};
`;

export const DetailsList = styled.div`
  display: flex;
  width: 100%;
  padding: ${layout.space.medium};
  gap: ${layout.space.medium};
  align-self: stretch;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
`;