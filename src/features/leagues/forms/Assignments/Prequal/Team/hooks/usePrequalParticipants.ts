import { useMemo } from "react";

import type { LeagueParticipantProfile } from "@/types/league.types";
import {
  buildDriverOptions,
  buildDriverParticipants,
  buildParticipantOptionsByProfileId,
} from "../../../DriverAssignments/util/DriverAssignments.util";

/**
 * Derives participant-related data for the driver assignment selects.
 *
 * Filters the full participant list to those with the "driver" role, builds
 * flat option arrays for ProfileSelectInput, and creates a profile-id keyed
 * lookup map so the current row value is preserved when options are filtered.
 */
export const usePrequalParticipants = (
  leagueParticipants?: LeagueParticipantProfile[],
) => {
  const driverParticipants = useMemo(
    () =>
      buildDriverParticipants(
        leagueParticipants,
      ),
    [leagueParticipants],
  );

  const driverOptions = useMemo(
    () =>
      buildDriverOptions(
        driverParticipants,
      ),
    [driverParticipants],
  );

  const participantOptionsByProfileId =
    useMemo(
      () =>
        buildParticipantOptionsByProfileId(
          leagueParticipants,
        ),
      [leagueParticipants],
    );

  const participantDetailsByProfileId =
    useMemo(
      () =>
        new Map(
          (leagueParticipants ?? []).map(
            (p) => [p.profile_id, p],
          ),
        ),
      [leagueParticipants],
    );

  return {
    driverParticipants,
    driverOptions,
    participantOptionsByProfileId,
    participantDetailsByProfileId,
  };
};