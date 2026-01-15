import styled, { keyframes } from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const Overlay = styled.div`
  position: fixed;
  inset: 0; 
  z-index: 999;
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const PanelContainer = styled.div`
  position: fixed;
  min-width: 360px;
  width: 100%;
  max-width: 480px;
  padding: ${layout.space.large};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1000;
  animation: ${slideIn} 0.25s ease-out;
    top: 0;
  right: 0;
  height: 100vh;
`;
