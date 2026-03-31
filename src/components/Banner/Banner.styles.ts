import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders } = designTokens;

export const BannerContainer = styled.div`
  width: 40px;
  height: 20px;
  border-radius: ${borders.radius.small};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.base.translucent10};
`;

export const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`