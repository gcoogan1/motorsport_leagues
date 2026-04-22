import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RootState } from "@/store";
import { usePanel } from "@/providers/panel/usePanel";
import { useModal } from "@/providers/modal/useModal";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { withMinDelay } from "@/utils/withMinDelay";
import { useCreateLeagueJoinRequest } from "@/hooks/rtkQuery/mutations/useLeagueMutation";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import LeagueIcon from "@assets/Icon/League.svg?react";
import JoinForm from "@/components/Forms/JoinForm/JoinForm";
import { joinFormSchema, type JoinFormValues } from "./leagueJoinSchema";
import RequestSent from "./modals/success/RequestSent/RequestSent";

type LeagueJoinProps = {
	leagueId?: string;
};

const selectableJoinRoles = LEAGUE_PARTICIPANT_ROLES.filter(
	(role) => role !== "director",
);

const LeagueJoin = ({ leagueId }: LeagueJoinProps) => {
	const { closePanel } = usePanel();
	const { openModal } = useModal();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const accountId = useSelector((state: RootState) => state.account.data?.id);
	const currentLeagueId = useSelector((state: RootState) => state.league.currentLeague?.id);
	const profiles = useSelector((state: RootState) => state.profile.data);

	const [createLeagueJoinRequest] = useCreateLeagueJoinRequest();

	const resolvedLeagueId = leagueId ?? currentLeagueId ?? "";
	const profileOptions = convertProfilesToSelectOptions(profiles ?? []);

	const joinOptions = useMemo(
		() =>
			selectableJoinRoles.map((role) => ({
				id: role,
				name: role,
				label: role.charAt(0).toUpperCase() + role.slice(1),
				defaultChecked: role === "driver",
			})),
		[],
	);

	const defaultOptions = useMemo(
		() =>
			joinOptions.reduce<Record<string, boolean>>((acc, option, index) => {
				const optionKey = option.name ?? option.id ?? `option_${index}`;
				acc[optionKey] = option.defaultChecked ?? false;
				return acc;
			}, {}),
		[joinOptions],
	);

  // -- Form Setup-- //
	const formMethods = useForm<JoinFormValues>({
		resolver: zodResolver(joinFormSchema),
		defaultValues: {
			leagueId: resolvedLeagueId,
			profile_joining: profileOptions[0]?.value ?? "",
			contactInfo: "",
			options: defaultOptions,
		},
		mode: "onChange",
	});

	const {
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = formMethods;

	useEffect(() => {
		setValue("leagueId", resolvedLeagueId, { shouldDirty: false });
	}, [resolvedLeagueId, setValue]);

	const optionValues = useWatch({
		control,
		name: "options",
	});

	const optionsErrorMessage =
		typeof errors.options?.message === "string"
			? errors.options.message
			: undefined;


  // -- Handlers -- //
  
	const handleOptionChange = (
		optionKey: string,
		checked: boolean,
		option: { onChange?: (checked: boolean) => void },
	) => {
		setValue(`options.${optionKey}`, checked, {
			shouldDirty: true,
			shouldValidate: true,
		});
		option.onChange?.(checked);
	};

	const handleJoinSubmit = async (data: JoinFormValues) => {
		if (!resolvedLeagueId || !data.profile_joining || !accountId) {
			return;
		}

		try {
			setIsSubmitting(true);

			const selectedRoles = selectableJoinRoles.filter((role) => data.options[role]);

			const requestResult = await withMinDelay(
				createLeagueJoinRequest({
					leagueId: resolvedLeagueId,
					profileId: data.profile_joining,
					accountId,
					contactInfo: data.contactInfo,
					roles: selectedRoles,
				}).unwrap(),
				600,
			);

			if (!requestResult.success) {
				handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
				return;
			}

			closePanel();

			openModal(<RequestSent />);
		} catch {
			handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<PanelLayout panelTitle="Join League" panelTitleIcon={<LeagueIcon />}>
			<FormProvider {...formMethods}>
				<JoinForm
					profiles={profileOptions}
					options={joinOptions}
					optionValues={optionValues}
					optionsError={optionsErrorMessage}
					profileError={errors.profile_joining?.message}
					contactInfoError={errors.contactInfo?.message}
					onOptionChange={handleOptionChange}
					onSubmit={handleSubmit(handleJoinSubmit)}
					submitLabel={isSubmitting ? "Requesting..." : "Request To Join"}
				/>
			</FormProvider>
		</PanelLayout>
	);
};

export default LeagueJoin;
