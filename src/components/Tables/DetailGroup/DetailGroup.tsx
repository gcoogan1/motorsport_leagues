import { Detail, DetailOption, DetailSetting, DetailsList, GroupContainer, Header, HeaderTitle } from "./DetailGroup.styles";

type DetailOption = {
  detailSetting: string;
  detailOption: string;
}

type DetailGroupProps = {
  details: DetailOption[];
  title: string;
};

const DetailGroup = ({ details, title }: DetailGroupProps) => {
  return (
    <GroupContainer>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
      </Header>
      <DetailsList>
        {details.map(({ detailSetting, detailOption }, index) => (
          <Detail key={index}>
            <DetailSetting>{detailSetting}</DetailSetting>
            <DetailOption>{detailOption}</DetailOption>
          </Detail>
        ))}
      </DetailsList>
    </GroupContainer>
  )
}

export default DetailGroup