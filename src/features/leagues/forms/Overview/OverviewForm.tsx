import SheetForm from "@/components/Sheets/SheetForm/SheetForm"

type OverviewFormProps = {
  leagueId: string;
  seasonName: string;
};

const OverviewForm = ({ leagueId, seasonName }: OverviewFormProps) => {
  console.log(leagueId, seasonName);
  return (
    <SheetForm id={"overview"} seasonName={seasonName} header={""} listChildren={undefined}    
    />
  )
}

export default OverviewForm