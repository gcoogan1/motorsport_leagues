import { useModal } from "@/providers/modal/useModal";
import Button from "../Button/Button";
import CloseIcon from "@assets/Icon/Close.svg?react";
import {
  ButtonWrapper,
  FormBody,
  FormHeader,
  FormTitle,
  FormWrapper,
  ListContainer,
  ModalOverlay,
  ResultsContainer,
} from "./Search.styles";
import SegmentedTab from "../SegmentedTabs/SegmentedTab";
import SearchInput from "../Inputs/SearchInput/SearchInput";

type SearchProps = {
  title: string;
  name: string;
  subtitle?: string;
  placeholder?: string;
  tabs: { label: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children?: React.ReactNode;
};

const Search = ({
  title,
  name,
  subtitle,
  placeholder,
  tabs,
  activeTab,
  onTabChange,
  children,
}: SearchProps) => {
  const { closeModal } = useModal();

  const handleClose = () => {
    closeModal();
  };

  return (
    <ModalOverlay>
        <FormWrapper>
          <ButtonWrapper>
            <Button
              color="base"
              variant="filled"
              rounded
              icon={{ left: <CloseIcon /> }}
              onClick={handleClose}
            />
          </ButtonWrapper>

          <FormHeader>
            <FormTitle>{title}</FormTitle>
            {subtitle && <div>{subtitle}</div>}
          </FormHeader>

          <FormBody>
            <SegmentedTab
              tabs={tabs}
              activeTab={activeTab}
              onChange={onTabChange}
            />
            <ListContainer>
              <SearchInput name={name} placeholder={placeholder} />
              <ResultsContainer>{children}</ResultsContainer>
            </ListContainer>
          </FormBody>
        </FormWrapper>
    </ModalOverlay>
  );
};

export default Search;
