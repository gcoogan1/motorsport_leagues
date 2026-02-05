import { ProfileStat, ProfileStatsContainer, StatLabel, StatNumber } from "./ProfileStats.styles";

type Stat = {
  number: number;
  label: string;
}

type ProfileStatsProps = {
  stats: Stat[];
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <ProfileStatsContainer>
      {stats.map((stat, index) => (
        <ProfileStat key={index}>
          <StatNumber>{stat.number}</StatNumber>
          <StatLabel>{stat.label}</StatLabel>
        </ProfileStat>
      ))}
    </ProfileStatsContainer>
  )
}

export default ProfileStats