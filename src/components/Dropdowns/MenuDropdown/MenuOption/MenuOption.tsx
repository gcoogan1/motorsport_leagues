import * as Select from "@radix-ui/react-select";
import Icon from "@/components/Icon/Icon";
import CheckIcon from "@assets/Icon/Check.svg?react";
import {
  DropdownMenuOption,
  OptionIndicator,
  OptionContent,
  OptionInfo,
  OptionLabel,
  OptionTypeContainer,
} from "./MenuOption.styles";
import Avatar from "@/components/Avatar/Avatar";
import Banner from "@/components/Banner/Banner";
import type { BannerImageValue } from "@/types/squad.types";

//NOTE: This component is meant to be used as a child of a Radix Select.Item component.

export type MenuTypes = "text" | "squad" | "profile" | "driver";

type MenuOptionProps = {
  type: MenuTypes;
  label: string;
  value: string;
  secondaryInfo?: string;
  icon?: React.ReactNode;
  banner?: BannerImageValue | "none";
  avatar?: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
  isStandAlone?: boolean;
  onSelect?: (value: string) => void;
};

const MenuOption = ({
  type,
  label,
  value,
  secondaryInfo,
  icon,
  banner,
  avatar,
  isStandAlone = false,
  onSelect,
}: MenuOptionProps) => {
  const showAvatar = (type === "profile" || type === "driver") && avatar;
  const avatarSize = type === "profile" ? "medium" : "tiny";
  const showIcon = type === "text" && icon;

  return (
    <>
      {isStandAlone ? (
        <DropdownMenuOption onClick={() => onSelect?.(value)}>
          <OptionContent>
            <OptionTypeContainer>
              {type === "squad" ? (
                <>
                  <Banner banner={banner ?? "none"} />
                  <OptionLabel>{label}</OptionLabel>
                </>
              ) : (
                <>
                  {showAvatar && (
                    <Avatar
                      avatarType={avatar.avatarType}
                      avatarValue={avatar.avatarValue}
                      size={avatarSize}
                    />
                  )}
                  {showIcon && <Icon size="medium">{icon}</Icon>}
                  <div>
                    <OptionLabel>{label}</OptionLabel>
                    {secondaryInfo && <OptionInfo>{secondaryInfo}</OptionInfo>}
                  </div>
                </>
              )}
            </OptionTypeContainer>
          </OptionContent>
        </DropdownMenuOption>
      ) : (
        <Select.Item value={value} asChild>
          <DropdownMenuOption>
            <OptionContent>
              <OptionTypeContainer>
                {type === "squad" ? (
                  <>
                    <Banner banner={banner ?? "none"} />
                    <OptionLabel>{label}</OptionLabel>
                  </>
                ) : (
                  <>
                    {showAvatar && (
                      <Avatar
                        avatarType={avatar.avatarType}
                        avatarValue={avatar.avatarValue}
                        size={avatarSize}
                      />
                    )}
                    {showIcon && <Icon size="medium">{icon}</Icon>}
                    <div>
                      <OptionLabel>{label}</OptionLabel>
                      {secondaryInfo && (
                        <OptionInfo>{secondaryInfo}</OptionInfo>
                      )}
                    </div>
                  </>
                )}
              </OptionTypeContainer>

              <OptionIndicator>
                <Icon size="small">
                  <CheckIcon />
                </Icon>
              </OptionIndicator>
            </OptionContent>
          </DropdownMenuOption>
        </Select.Item>
      )}
    </>
  );
};

export default MenuOption;
