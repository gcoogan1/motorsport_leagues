import { ClickableWrapper, ImageContainer, MemberCountText, NameText, TextContainer } from "./SquadCard.styles";

type SquadCardProps = {
  name: string;
  memberCount: number;
  bannerImageUrl?: string;
  size: "small" | "medium";
  onClick?: () => void;
}

const SquadCard = ({ name, memberCount, bannerImageUrl, size, onClick }: SquadCardProps) => {
  return (
    <ClickableWrapper $cardSize={size} onClick={onClick}>
      <ImageContainer $cardSize={size} $imageBg={bannerImageUrl} />
      <TextContainer $cardSize={size}>
        <NameText>{name}</NameText>
        <MemberCountText>{memberCount} members</MemberCountText>
      </TextContainer>
    </ClickableWrapper>
  )
}

export default SquadCard