import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, borders, typography } = designTokens;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.theme.primaryA};
  padding: 0 ${layout.space.xxSmall};
  border-radius: ${borders.radius.small};
`;

export const StatusText = styled.p`
  ${typography.body.smallBold};
  color: ${colors.base.base3};
`