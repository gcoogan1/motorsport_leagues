import LinkOption from "./components/LinkOption/LinkOption";
import { LinkListContainer, SectionList, SectionTitle } from "./LinkList.styles";

type PanelOptions = {
  optionType: "text" | "account";
  optionTitle: string;
  optionHelper?: string;
  optionIcon: React.ReactNode;
  optionIconLabel: string;
  onOptionClick: () => void;
}

type LinkListProps = {
  sectionTitle?: string;
  options?: PanelOptions[];
};

const LinkList = ({ sectionTitle, options }: LinkListProps) => {
  return (
    <LinkListContainer>
      {sectionTitle && <SectionTitle>{sectionTitle}</SectionTitle>}
      <SectionList>
        {options && options.map((option, index) => (
          <LinkOption
            key={index}
            optionType={option.optionType}
            optionTitle={option.optionTitle}
            optionHelper={option.optionHelper}
            optionIcon={option.optionIcon}
            optionIconLabel={option.optionIconLabel}
            onOptionClick={option.onOptionClick}
          />
        ))}
      </SectionList>
    </LinkListContainer>
  )
}

export default LinkList