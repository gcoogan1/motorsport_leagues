import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";
import AlphaBackground from "@/assets/Alpha/alpha-bg.png";


const { colors, layout, borders } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: center;
  padding: ${layout.space.xxxLarge};
  background-color: ${colors.base.base2};
  height: 1024px;

  ${layout.mediaQueries.mobile} {
    padding: 32px;
    min-height: 0;
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-self: stretch;
  align-items: center;
  gap: ${layout.space.medium};
  background-image: url(${AlphaBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-top-right-radius: ${borders.radius.xxxLarge};
  border-top-left-radius: ${borders.radius.xxxLarge};
  padding: 64px 0;
  height: 940px;

  ${layout.mediaQueries.mobile} {
    border-top-right-radius: 40px;
    border-top-left-radius: 40px;
    height: 720px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

export const LogoImage = styled.img`
  width: 480px;
  height: 127px;

  ${layout.mediaQueries.mobile} {
    width: 302px;
    height: 80px;
    aspect-ratio: 151/40;
  }
`;

export const SubTitle = styled.h2`
  color: #E6C356;
  text-align: center;
  font-family: Quantico;
  font-size: 24px;
  font-style: italic;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  opacity: 0.5;

  ${layout.mediaQueries.mobile} {
    font-size: 20px;
  }
`;

export const DiscordButton = styled.button`
  display: flex;
  border: none;
  padding: ${layout.space.medium};
  justify-content: center;
  color: ${colors.text.text1};
  align-items: center;
  gap: ${layout.space.xxSmall};
  border-radius: ${borders.radius.medium};
  background: #5E63EC;

  &:hover {
    background-color: #5b6eae;
  }
`;