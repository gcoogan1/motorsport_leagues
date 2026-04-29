import { useEffect, useMemo, useRef } from "react";
import { navigate } from "@/app/navigation/navigation";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import {
  useLeagueApplicationOptions,
  useLeagueJoinRequests,
  useLeagueParticipants,
} from "@/rtkQuery/hooks/queries/useLeagues";
import {
  useAddLeagueApplicationOptions,
  useAddLeagueParticipantRole,
  useRemoveLeagueParticipantRole,
  useUpdateLeagueApplicationOptions,
} from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import { ParticipantTable } from "@/components/Tables/InputTable/InputTable";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import ContactIcon from "@assets/Icon/Contact.svg?react";
import KickIcon from "@assets/Icon/Kick.svg?react";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import ControlPanel from "@/components/Inputs/ControlPanel/ControlPanel";
import SpecialInputTable from "@/components/Tables/SpecialInputTable/SpecialInputTable";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import ViewRequest from "@/features/leagues/forms/ViewRequest/ViewRequest";
import ContactInfo from "@/features/leagues/forms/ContactInfo/ContactInfo";
import RemoveParticipant from "@/features/leagues/modals/core/RemoveParticipant/RemoveParticipant";
import RejectRequest from "@/features/leagues/modals/core/RejectRequest/RejectRequest";
import NoDirector from "@/features/leagues/modals/errors/NoDirector/NoDirector";
import UnassignedParticipant from "@/features/leagues/modals/errors/UnassignedParticipant/UnassignedParticipant";
import type { GroupedJoinRequest, LeagueRole, LeagueRoleTag, RolesFormValues } from "./Roles.types";
import { toRoleSet, getUnassignedParticipantIndexes, getNoDirectorErrorIndexes } from "./Roles.utils";

type RolesProps = {
  leagueId: string;
  onDirtyChange?: (isDirty: boolean) => void;
};

const Roles = ({ leagueId, onDirtyChange }: RolesProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const hasHydratedRef = useRef(false);
  const [addLeagueApplicationOptions] = useAddLeagueApplicationOptions();
  const [addLeagueParticipantRole] = useAddLeagueParticipantRole();
  const [removeLeagueParticipantRole] = useRemoveLeagueParticipantRole();
  const [updateLeagueApplicationOptions] = useUpdateLeagueApplicationOptions();
  const { data: leagueApplicationOptions } = useLeagueApplicationOptions(leagueId);
  const { data: joinRequests = [] } = useLeagueJoinRequests(leagueId);
  const { data: participants = [] } = useLeagueParticipants(leagueId);
  

  // -- Form Setup -- //
  const formMethods = useForm<RolesFormValues>({
    defaultValues: {
      options: ["driver"],
      openApplications: true,
      participants: [],
    },
  });

  const {
    clearErrors,
    control,
    getValues,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { isDirty, isSubmitting },
  } = formMethods;

  const selectedRoles = useWatch({
    control,
    name: "options",
  }) ?? [];

  const isOpen = useWatch({
    control,
    name: "openApplications",
  }) ?? true;

  const watchedParticipants = useWatch({
    control,
    name: "participants",
  }) ?? [];

  // -- Helpers -- //

  // Map league participant roles to options - for the role column
  const roleOptions = useMemo(
    () =>
      LEAGUE_PARTICIPANT_ROLES.filter((role) => role !== "director").map((role) => ({
        name: role,
        label: role.charAt(0).toUpperCase() + role.slice(1),
      })),
    [],
  );

  // Group raw join-request rows by profile - so each profile appears once.
  const groupedJoinRequests = useMemo(() => {
    const grouped = new Map<string, GroupedJoinRequest>();

    joinRequests.forEach((request) => {
      const existing = grouped.get(request.profile_id);

      if (!existing) {
        grouped.set(request.profile_id, {
          requestId: request.id,
          profileId: request.profile_id,
          accountId: request.account_id,
          username: request.username,
          avatarType: request.avatar_type,
          avatarValue: request.avatar_value,
          contactInfo: request.contact_info,
          requestIds: [request.id],
          requestedRoles: [request.requested_role],
        });
        return;
      }

      existing.requestIds.push(request.id);

      if (!existing.requestedRoles.includes(request.requested_role)) {
        existing.requestedRoles.push(request.requested_role);
      }
    });

    return Array.from(grouped.values());
  }, [joinRequests]);

  // Map participants to form rows - for the participant table. 
  // Memoize to avoid unnecessary recalculations and to keep reference equality for form state.
  const participantFormRows = useMemo(
    () =>
      participants.map((participant) => ({
        participantId: participant.id,
        profileId: participant.profile_id,
        participant: {
          username: participant.username,
          information: "",
          size: "small" as const,
          avatarType: participant.avatar_type,
          avatarValue: participant.avatar_value,
        },
        selectedRoles: participant.roles as LeagueRoleTag[],
        contactInfo: participant.contact_info,
        gameType: participant.game_type,
      })),
    [participants],
  );

  // Map league participant roles to options - for the role column
  const participantRoleOptions = useMemo(
    () =>
      LEAGUE_PARTICIPANT_ROLES.map((role) => ({
        value: role as LeagueRoleTag,
        label: role.charAt(0).toUpperCase() + role.slice(1),
      })),
    [],
  );

  // Keep participants in sync and treat synced data as clean defaults.
  useEffect(() => {
    if (isDirty) {
      return;
    }

    // Get open roles from league application options.
    const optionsSource = (leagueApplicationOptions?.open_roles ?? ["driver"]) as LeagueRole[];
    const nextOptions = optionsSource.filter((role) => role !== "director") as LeagueRoleTag[];

    const currentValues = getValues();
    reset(
      {
        ...currentValues,
        options: nextOptions,
        openApplications: leagueApplicationOptions?.contact_info ?? true,
        participants: participantFormRows,
      },
      {
        keepDirty: false,
        keepTouched: false,
      },
    );

    hasHydratedRef.current = true;
  }, [participantFormRows, leagueApplicationOptions, isDirty, getValues, reset]);

  // Notify parent page to gate section navigation with UnsavedChanges modal.
  useEffect(() => {
    if (!hasHydratedRef.current) {
      onDirtyChange?.(false);
      return;
    }

    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Warn users about unsaved changes on tab/browser close.
  useEffect(() => {
    if (!hasHydratedRef.current || !isDirty) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);


  // Add/remove roles between previous and next role selections.
  const getRoleChanges = ({
    previousRoles,
    nextRoles,
  }: {
    previousRoles: Set<LeagueRole>;
    nextRoles: Set<LeagueRole>;
  }) => {
    const rolesToAdd = Array.from(nextRoles).filter((role) => !previousRoles.has(role));
    const rolesToRemove = Array.from(previousRoles).filter((role) => !nextRoles.has(role));

    return { rolesToAdd, rolesToRemove };
  };

  const setParticipantRoleErrors = (indexes: number[]) => {
    indexes.forEach((index) => {
      setError(`participants.${index}.selectedRoles`, {
        type: "manual",
      });
    });
  };



  // -- Handlers -- //

  const handleSave = handleSubmit(async (data) => {
    try {
      // Snapshot the current roles from query data.
      const originalRolesByParticipantId = new Map<string, Set<LeagueRole>>(
        participants.map((participant) => [
          participant.id,
          toRoleSet(participant.roles),
        ]),
      );

      clearErrors("participants");

      // UNASSIGNED PARTICIPANT CHECK
      const unassignedParticipantIndexes = getUnassignedParticipantIndexes(data.participants);

      if (unassignedParticipantIndexes.length > 0) {
        setParticipantRoleErrors(unassignedParticipantIndexes);

        openModal(<UnassignedParticipant />);
        return;
      }

      // NO DIRECTOR CHECK
      const noDirectorErrorIndexes = getNoDirectorErrorIndexes({
        rows: data.participants,
        originalRolesByParticipantId,
      });

      if (noDirectorErrorIndexes.length > 0) {
        setParticipantRoleErrors(noDirectorErrorIndexes);

        openModal(<NoDirector />);
        return;
      }

      // Payload for control-panel options and participant role changes
      const savePayload = {
        controlPanel: {
          selectedRoles: data.options,
          openApplications: data.openApplications,
        },
        participantRoleChanges: data.participants.map((row) => {
          const previousRoles = originalRolesByParticipantId.get(row.participantId) ?? new Set();
          const nextRoles = toRoleSet(row.selectedRoles);
          const { rolesToAdd, rolesToRemove } = getRoleChanges({ previousRoles, nextRoles });

          return {
            participantId: row.participantId,
            rolesToAdd,
            rolesToRemove,
          };
        }),
      };
      // Control Panel changes //

      // Check if application options have changed and need to be updated/added before participant role changes.
      const nextOpenRoles = [...new Set(savePayload.controlPanel.selectedRoles)] as LeagueRole[];
      const currentOpenRoles = [...new Set(leagueApplicationOptions?.open_roles ?? [])] as LeagueRole[];
      const hasOpenRolesChanged =
        nextOpenRoles.length !== currentOpenRoles.length
        || nextOpenRoles.some((role) => !currentOpenRoles.includes(role));

      const nextContactInfo = savePayload.controlPanel.openApplications;
      const currentContactInfo = leagueApplicationOptions?.contact_info ?? true;

      const nextIsClosed = nextOpenRoles.length === 0;
      const currentIsClosed = leagueApplicationOptions?.is_closed ?? false;

      const shouldUpdateApplicationOptions =
        !leagueApplicationOptions
        || hasOpenRolesChanged
        || nextContactInfo !== currentContactInfo
        || nextIsClosed !== currentIsClosed;

      if (shouldUpdateApplicationOptions) {
        const applicationOptionsResult = leagueApplicationOptions
          ? await updateLeagueApplicationOptions({
            leagueId,
            openRoles: nextOpenRoles,
            contactInfo: nextContactInfo,
            isClosed: nextIsClosed,
          }).unwrap()
          : await addLeagueApplicationOptions({
            leagueId,
            openRoles: nextOpenRoles,
            contactInfo: nextContactInfo,
            isClosed: nextIsClosed,
          }).unwrap();

        if (!applicationOptionsResult.success) {
          handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
          return;
        }
      }

      // Participant role changes //

      // Add/remove requests from the role-change portion of the payload.
      const roleChangeRequests: Promise<{ success: boolean }>[] = [];

      savePayload.participantRoleChanges.forEach((row) => {
        row.rolesToAdd.forEach((role) => {
          roleChangeRequests.push(
            addLeagueParticipantRole({
              participantId: row.participantId,
              role,
            }).unwrap(),
          );
        });

        row.rolesToRemove.forEach((role) => {
          roleChangeRequests.push(
            removeLeagueParticipantRole({
              participantId: row.participantId,
              role,
            }).unwrap(),
          );
        });
      });

      const hasParticipantRoleChanges = roleChangeRequests.length > 0;

      if (!hasParticipantRoleChanges) {
        if (shouldUpdateApplicationOptions) {
          showToast({
            usage: "success",
            message: "Application options updated.",
          });
        }

        // Treat this as a save checkpoint so unsaved-changes guard does not linger.
        reset(data);
        return;
      }

      const results = await Promise.all(roleChangeRequests);

      if (!results.every((result) => result.success)) {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
        return;
      }

      showToast({
        usage: "success",
        message: shouldUpdateApplicationOptions
          ? "Participant roles and application options updated."
          : "Participant roles updated.",
      });

      // Update form defaults to latest saved values to clear dirty state.
      reset(data);
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    }
  });

  // -- Form Contents -- //
  const headerChildren = (
    <ControlPanel
      checkboxOptions={roleOptions}
      selectedValues={selectedRoles}
      onCheckboxChange={(values) => {
        setValue("options", values, { shouldDirty: true, shouldValidate: true });
      }}
      toggle={{
        name: "openApplications",
        label: "Open Applications",
        isOn: isOpen,
        helperMessage: "Allow users to apply for selected roles.",
        onChange: (next) => {
          setValue("openApplications", next, { shouldDirty: true, shouldValidate: true });
        },
      }}
    />
  );

  const listChildren = (
    <>
      {groupedJoinRequests.length > 0 && (
        <SpecialInputTable
          header="Join Requests"
          rows={groupedJoinRequests.map((request) => ({
            id: request.profileId,
            user: {
              username: request.username,
              information: "",
              size: "small",
              avatarType: request.avatarType,
              avatarValue: request.avatarValue,
            },
            actions: [
              {
                label: "View Profile",
                value: "view-profile",
                icon: <ProfileIcon />,
                onSelect: () => navigate(`/profile/${request.profileId}`),
              },
              {
                label: "View Request",
                value: "view-request",
                icon: <ContactIcon />,
                onSelect: () => {
                  openModal(
                    <ViewRequest
                      leagueId={leagueId}
                      request={{
                        profileId: request.profileId,
                        accountId: request.accountId,
                        username: request.username,
                        avatarType: request.avatarType,
                        avatarValue: request.avatarValue,
                        requestedRoles: request.requestedRoles,
                        requestIds: request.requestIds,
                        contactInfo: request.contactInfo,
                      }}
                    />,
                  );
                },
              },
              {
                label: "Reject Request",
                value: "reject-request",
                icon: <KickIcon />,
                onSelect: () => {
                  openModal(
                    <RejectRequest
                      leagueId={leagueId}
                      requestId={request.requestId}
                    />,
                  );
                },
              },
            ],
          }))}
        />
      )}
      {participantFormRows.length > 0 && (
        <ParticipantTable
          name="participants"
          columns={{
            number: {
              id: "number",
              name: "number",
              value: "#",
            },
            participant: {
              id: "participant",
              name: "participant",
            },
            role: {
              id: "role",
              name: "selectedRoles",
              options: participantRoleOptions,
            },
          }}
          actions={(rowIndex) => {
            const rowsForActions = watchedParticipants.length > 0
              ? watchedParticipants
              : participantFormRows;
            const row = rowsForActions[rowIndex];
            const participantCount = rowsForActions.length;
            const directorCount = rowsForActions.filter((participantRow) =>
              toRoleSet(participantRow.selectedRoles).has("director")
            ).length;

            const baseActions = [
              {
                label: "View Profile",
                value: "view-profile",
                icon: <ProfileIcon />,
                onSelect: () => {
                  if (row?.profileId) {
                    navigate(`/profile/${row.profileId}`);
                  }
                },
              },
            ];

            // Only add Contact Info action if contact info exists
            if (row?.contactInfo) {
              baseActions.splice(1, 0, {
                label: "Contact Info",
                value: "contact-info",
                icon: <ContactIcon />,
                onSelect: () => {
                  openModal(
                    <ContactInfo
                      profile={{
                        username: row.participant.username,
                        avatarType: row.participant.avatarType,
                        gameType: row.gameType || "",
                        avatarValue: row.participant.avatarValue,
                      }}
                      contactInfo={row.contactInfo!}
                    />,
                  );
                },
              });
            }

            if (participantCount > 1) {
              baseActions.push({
                label: "Remove Participant",
                value: "remove-participant",
                icon: <KickIcon />,
                onSelect: () => {
                  if (!row) {
                    return;
                  }

                  const isOnlyDirectorBeingRemoved =
                    toRoleSet(row.selectedRoles).has("director") && directorCount === 1;

                  if (isOnlyDirectorBeingRemoved) {
                    openModal(<NoDirector removeAttempt={true} />);
                    return;
                  }

                  if (!row.profileId) {
                    return;
                  }

                  openModal(
                    <RemoveParticipant
                      leagueId={leagueId}
                      profileId={row.profileId}
                    />,
                  );
                },
              });
            }

            return baseActions;
          }}
        />
      )}
    </>
  );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={`league-settings-${leagueId}`}
        seasonName={"Manage League"}
        header="Participant Roles"
        headerChildren={headerChildren}
        blockHeader="Application Options"
        blockDescription="Select which roles you want to allow users to apply for in this League. Unselect all to keep registration closed."
        listChildren={listChildren}
        onSave={handleSave}
        isSaving={isSubmitting}
        saveLoadingText="Saving Changes..."
      />
    </FormProvider>
  );
};

export default Roles;
