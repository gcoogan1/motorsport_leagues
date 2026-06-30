import { designTokens } from "@/app/design/tokens";


const { colors } = designTokens;

export type Tag = 'director' | 'founder' | 'driver' |  'host' | 'steward' | 'broadcaster' | 'staff' | 'champion';

export type TagVariant = {
  name: string;
  label: string;
  color?: string;
  background?: string;
}

export const getTagVariants = (): TagVariant[] => {

  return [
    { name: "director", label: "Director", color: colors.text.text1, background: colors.role.director },
    { name: "founder", label: "Founder", color: colors.text.text1, background: colors.role.director },
    { name: "driver", label: "Driver" },
    { name: "host", label: "Host" },
    { name: "steward", label: "Steward" },
    { name: "broadcaster", label: "Broadcast" },
    { name: "staff", label: "Staff" },
    { name: "champion", label: "Champion" },
  ];
};