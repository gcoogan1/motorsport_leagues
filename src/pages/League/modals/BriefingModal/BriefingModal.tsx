import { useMemo, useState } from "react";
import SheetModal from "@/components/Sheets/SheetModal/SheetModal";
import Briefing from "@/components/Structures/Briefing/Briefing";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import FilterBar from "@/components/Tabs/FilterBar/FilterBar";
import BriefingIcon from "@assets/Icon/Briefing.svg?react";
import { useModal } from "@/providers/modal/useModal";
import { useLeagueSeasonDivisions } from "@/rtkQuery/hooks/queries/useLeagueSeasonDivisions";
import { useRoundsBySeason } from "@/rtkQuery/hooks/queries/useRounds";
import { sortRounds } from "@/features/leagues/forms/Schedule/Schedule.util";

type BriefingModalProps = {
  roundId: string;
  seasonId: string;
  seasonName: string;
};

const BriefingModal = ({ roundId, seasonId, seasonName }: BriefingModalProps) => {
  const { closeModal } = useModal();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const seasonDivisions = useLeagueSeasonDivisions(seasonId);
  const roundsBySeason = useRoundsBySeason(seasonId);

  const divisionOptions = useMemo(
    () =>
      (seasonDivisions.data ?? []).map((division) => ({
        label: division.division_name,
        value: division.id,
      })),
    [seasonDivisions.data],
  );

  const rounds = useMemo(
    () => sortRounds(roundsBySeason.data ?? []),
    [roundsBySeason.data],
  );

  const initialRound = useMemo(
    () => rounds.find((round) => round.id === roundId),
    [roundId, rounds],
  );

  const effectiveDivisionId = useMemo(() => {
    if (selectedDivisionId && divisionOptions.some((division) => division.value === selectedDivisionId)) {
      return selectedDivisionId;
    }

    if (initialRound?.division_id) {
      return initialRound.division_id;
    }

    return divisionOptions[0]?.value ?? "";
  }, [divisionOptions, initialRound, selectedDivisionId]);

  const roundsForDivision = useMemo(
    () => rounds.filter((round) => round.division_id === effectiveDivisionId),
    [effectiveDivisionId, rounds],
  );

  const roundOptions = useMemo(
    () => roundsForDivision.map((round) => ({ label: round.round_name, value: round.id })),
    [roundsForDivision],
  );

  const effectiveRoundId = useMemo(() => {
    if (selectedRoundId && roundsForDivision.some((round) => round.id === selectedRoundId)) {
      return selectedRoundId;
    }

    if (initialRound && initialRound.division_id === effectiveDivisionId) {
      return initialRound.id;
    }

    return roundsForDivision[0]?.id ?? "";
  }, [effectiveDivisionId, initialRound, roundsForDivision, selectedRoundId]);

  const selectedRound = useMemo(
    () => rounds.find((round) => round.id === effectiveRoundId),
    [effectiveRoundId, rounds],
  );

  const filters = divisionOptions.length > 0 || roundOptions.length > 0 ? (
    <FilterBar
      divisions={divisionOptions}
      rounds={roundOptions}
      events={[]}
      sessions={[]}
      selectedDivision={effectiveDivisionId}
      selectedRound={effectiveRoundId}
      onDivisionChange={setSelectedDivisionId}
      onRoundChange={setSelectedRoundId}
    />
  ) : undefined;

  const listChildren = selectedRound?.briefing ? (
    <Briefing content={selectedRound.briefing} />
  ) : (
    <EmptyMessage
      icon={<BriefingIcon />}
      title="No Briefing"
      subtitle={selectedRound ? "Driver briefing has not been added for this round yet." : "No rounds are available for this division yet."}
    />
  );

  return (
    <SheetModal
      id={"league-briefing-modal"}
      seasonName={seasonName}
      header={"Driver Briefing"}
      listChildren={listChildren}
      filters={filters}
      onClose={closeModal}
      fullScreen
    ></SheetModal>
  );
};

export default BriefingModal;
