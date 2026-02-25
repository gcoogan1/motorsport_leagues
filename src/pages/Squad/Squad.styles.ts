import styled from "styled-components";

import { designTokens } from "@/app/design/tokens";

const { colors  } = designTokens;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  flex: 1;
  background-color: ${colors.base.base2};
`;