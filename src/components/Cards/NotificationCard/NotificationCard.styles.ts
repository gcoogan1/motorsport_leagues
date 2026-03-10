import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors, gradients, layout, typography, borders } = designTokens;

export const CardContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${layout.space.medium};
  padding: ${layout.space.medium};
  background: ${gradients.base.fadeRight10};
  border-radius: ${borders.radius.medium};
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  gap: ${layout.space.xSmall};
`;

export const AvatarWrapper = styled.div`
  flex-shrink: 0;
`;

export const TextContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${layout.space.xxxSmall};
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${layout.space.xxxSmall};
`;

export const Title = styled.p`
  ${typography.body.mediumBold}
  color: ${colors.text.text2};
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
`;

export const Timestamp = styled.p`
  ${typography.body.tinyRegular}
  color: ${colors.text.text2};
`;

export const Message = styled.p`
  ${typography.body.mediumRegular}
  color: ${colors.text.text1};
`;

// export const BoldText = styled.span`
//   ${typography.body.mediumBold}
//   color: ${colors.text.text1};
// `

export const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${layout.space.xSmall};
`;