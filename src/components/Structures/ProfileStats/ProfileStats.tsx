import { ProfileStat, ProfileStatsContainer, StatLabel, StatLabelsWrapper, StatNumber } from "./ProfileStats.styles";

type Stat = {
  number: number;
  labelStat: string;
  labelFact: string;
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
          <StatLabelsWrapper>
            <StatLabel>{stat.labelStat}</StatLabel>
            <StatLabel>{stat.labelFact}</StatLabel>
          </StatLabelsWrapper>
        </ProfileStat>
      ))}
    </ProfileStatsContainer>
  )
}

export default ProfileStats