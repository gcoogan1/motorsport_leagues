import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, typography, borders, layout } = designTokens;

export const InputContainer = styled.div`
  display: flex;
  gap: ${layout.space.xxxSmall};
  flex-direction: column;
  width: 100%;
  align-items: center;
`

export const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  background: ${gradients.base.fadeBottom10};
  border-top-right-radius: ${borders.radius.xxLarge};
  border-top-left-radius: ${borders.radius.xxLarge};
  padding: ${layout.space.xLarge};
  gap: ${layout.space.medium};
`

export const ImageUpload = styled.div`
  width: 100%;
  max-width: 640px;
  aspect-ratio: 2 / 1;
  object-fit: cover;
  border-radius: ${borders.radius.medium};
  background: ${colors.base.translucent10};
  overflow: hidden;


  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${borders.radius.medium};
  }
`
export const Placeholder = styled.div`
  width: 100%;
  max-width: 640px;
  aspect-ratio: 2 / 1;
  border-radius: ${borders.radius.medium};
  background: ${colors.base.translucent10};
`

export const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: ${layout.space.xxSmall};
`

export const HelperMessage = styled.p`
  ${typography.body.smallRegular};
  color: ${colors.text.text2};
  text-align: center;
`

export const ErrorText = styled.span`
  ${typography.body.smallBold}
  color: ${colors.alert.alertA};
  display: flex;
  gap: ${layout.space.xxxSmall};
`;