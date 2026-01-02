import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { layout } = designTokens;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200px ${layout.space.large};
  z-index: 1000;
`;