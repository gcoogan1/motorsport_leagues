import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, typography, layout, borders } = designTokens;

export const MessageWrapper = styled.div`
  display: flex;
  max-width: 400px;
  width: 100%;
  justify-content: center;
  gap: ${layout.space.xSmall};
`;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${layout.space.xxxSmall};
  flex: 1 0 0;
`;

export const Top = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
`

export const UsernameContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
  flex: 1 0 0;
`

export const Username = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  background: ${colors.base.translucent10};
  border-radius: ${borders.radius.small} ${borders.radius.xxLarge} ${borders.radius.xxLarge} ${borders.radius.xxLarge};
`

export const Header = styled.div`
  display: flex;
  padding: ${layout.space.small};
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
  row-gap: 8px;
  align-self: stretch;
  flex-wrap: wrap;
  background: ${colors.base.translucent10};
  border-radius: ${borders.radius.small} ${borders.radius.xxLarge} 0 0;
`

export const TextContainer = styled.div`
  display: flex;
  min-width: 120px;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
`

export const TicketNumber = styled.p`
  ${typography.subtitle.medium};
  color: ${colors.text.text1};
`

export const SeasonName = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
`

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: ${layout.space.xxSmall};
`

export const Message = styled.div`
  display: flex;
  padding: ${layout.space.small};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${layout.space.xxSmall};
  align-self: stretch;
  background: transparent;
`

export const Pair = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${layout.space.xxSmall};
  align-self: stretch;
`;

export const KeyItem = styled.div`
  display: flex;
  width: 80px;
  gap: 10px;
`;

export const KeyText = styled.p`
  ${typography.body.mediumBold};
  color: ${colors.text.text1};
`;

export const ValueItem = styled.div`
  display: flex;
  gap: 10px;
  flex: 1 0 0;
`

export const ValueText = styled.p`
  ${typography.body.mediumRegular};
  color: ${colors.text.text1};
`;

export const Bottom = styled.div`
  display: flex;
  padding: 0 ${layout.space.small};

  gap: 10px;
  align-self: stretch;
`

export const TimestampText = styled.p`
  ${typography.body.tinyRegular};
  color: ${colors.text.text2};
`