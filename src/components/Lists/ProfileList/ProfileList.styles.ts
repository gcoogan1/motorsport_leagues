import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, borders, layout } = designTokens; 

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${borders.radius.xLarge};
  border: ${borders.width.thin} solid ${colors.base.translucent10};
`
export const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: ${layout.space.xxSmall};
  padding-top: ${layout.space.medium};
  padding-bottom: ${layout.space.medium};
  padding-right: ${layout.space.xSmall};
  padding-left: ${layout.space.medium};
  border-bottom: ${borders.width.thin} solid ${colors.base.translucent10};

  &:last-child {
    border-bottom: none;
  }
`

export const UserProfileWrapper = styled.div`
  overflow: hidden;
  max-width: 248px;
`
