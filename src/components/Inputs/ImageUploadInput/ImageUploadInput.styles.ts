import styled from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, gradients, typography, borders, layout } = designTokens;

export const InputContainer = styled.div`
  display: flex;
  width: 400px;
  gap: ${layout.space.xxxSmall};
  flex-direction: column;
`

export const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background: ${gradients.base.fadeBottom10};
  border-top-right-radius: ${borders.radius.xxLarge};
  border-top-left-radius: ${borders.radius.xxLarge};
  padding: ${layout.space.xLarge};
  gap: ${layout.space.medium};
`

export const ImageUpload = styled.div`
  width: 336px;
  height: 160px;
  object-fit: cover;
  border-radius: ${borders.radius.medium};
  background: ${colors.base.translucent10};


  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${borders.radius.medium};
  }
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
  text-transform: capitalize;
`

export const ErrorText = styled.span`
  ${typography.body.smallBold}
  color: ${colors.alert.alertA};
  display: flex;
  gap: ${layout.space.xxxSmall};
`;
