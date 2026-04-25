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
import { useLeagueApplicationOptions } from "@/hooks/rtkQuery/queries/useLeagues";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import LeagueIcon from "@assets/Icon/League.svg?react";
import JoinForm from "@/components/Forms/JoinForm/JoinForm";
import { joinFormSchema, type JoinFormValues } from "./leagueJoinSchema";
import RequestSent from "./modals/success/RequestSent/RequestSent";

type LeagueJoinProps = {
	leagueId?: string;
};

type JoinRole = Exclude<typeof LEAGUE_PARTICIPANT_ROLES[number], "director">;

const LeagueJoin = ({ leagueId }: LeagueJoinProps) => {
	const { closePanel } = usePanel();
	const { openModal } = useModal();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const accountId = useSelector((state: RootState) => state.account.data?.id);
	const currentLeagueId = useSelector((state: RootState) => state.league.currentLeague?.id);
	const profiles = useSelector((state: RootState) => state.profile.data);

	const [createLeagueJoinRequest] = useCreateLeagueJoinRequest();

	const resolvedLeagueId = leagueId ?? currentLeagueId ?? "";

  // Fetch league application options to determine which roles are open for joining and if the league is accepting applications at all.
	const {
		data: leagueApplicationOptions,
		isLoading: isApplicationOptionsLoading,
	} = useLeagueApplicationOptions(resolvedLeagueId);
	const profileOptions = convertProfilesToSelectOptions(profiles ?? []);

  // Determine which participant roles are available for joining based on league application options.
	const availableJoinRoles = useMemo(() => {
		if (leagueApplicationOptions?.is_closed) {
			return [] as JoinRole[];
		}

		const optionsRoles = (leagueApplicationOptions?.open_roles ?? []) as typeof LEAGUE_PARTICIPANT_ROLES[number][];
		const configuredRoles = optionsRoles.filter((role): role is JoinRole => role !== "director");

		if (configuredRoles.length === 0) {
			return [] as JoinRole[];
		}

		return configuredRoles;
	}, [leagueApplicationOptions]);

  // Format available roles into options for the form.
	const joinOptions = useMemo(
		() =>
			availableJoinRoles.map((role, index) => ({
				id: role,
				name: role,
				label: role.charAt(0).toUpperCase() + role.slice(1),
				defaultChecked: role === "driver" || (index === 0 && !availableJoinRoles.includes("driver")),
			})),
		[availableJoinRoles],
	);

  // Set default option values based on available roles and their defaultChecked status for form default values.
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
		clearErrors,
		getValues,
		setError,
		setValue,
		control,
		formState: { errors },
	} = formMethods;

	const showContactInfo = leagueApplicationOptions?.contact_info ?? true;

	useEffect(() => {
		setValue("leagueId", resolvedLeagueId, { shouldDirty: false });
	}, [resolvedLeagueId, setValue]);

	useEffect(() => {
		setValue("options", defaultOptions, {
			shouldDirty: false,
			shouldValidate: false,
		});
	}, [defaultOptions, setValue]);

	useEffect(() => {
		if (showContactInfo) {
			return;
		}

		setValue("contactInfo", "", {
			shouldDirty: false,
			shouldValidate: false,
		});
		clearErrors("contactInfo");
	}, [showContactInfo, setValue, clearErrors]);

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

		if (showContactInfo && data.contactInfo.trim().length < 2) {
			setError("contactInfo", {
				type: "manual",
				message: "Please enter contact information.",
			});
			return;
		}

		try {
			setIsSubmitting(true);

			const selectedRoles = availableJoinRoles.filter((role) => data.options[role]);

			const requestResult = await withMinDelay(
				createLeagueJoinRequest({
					leagueId: resolvedLeagueId,
					profileId: data.profile_joining,
					accountId,
					contactInfo: showContactInfo ? data.contactInfo : "",
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

	const handleInvalidSubmit = () => {
		if (!showContactInfo) {
			clearErrors("contactInfo");
			return;
		}

		const contactValue = (getValues("contactInfo") ?? "").trim();

		if (contactValue.length < 2) {
			setError("contactInfo", {
				type: "manual",
				message: "Please enter contact information.",
			});
		}
	};

	if (isApplicationOptionsLoading) {
		return null;
	}

	const isLeagueClosedForApplications =
		availableJoinRoles.length === 0;

	return (
		<PanelLayout panelTitle="Join League" panelTitleIcon={<LeagueIcon />}>
			{isLeagueClosedForApplications ? (
				<EmptyMessage
					title="Applications Closed"
					icon={<LeagueIcon />}
					subtitle="This League is not currently accepting participants at this time."
				/>
			) : (
				<FormProvider {...formMethods}>
					<JoinForm
						profiles={profileOptions}
						options={joinOptions}
						optionValues={optionValues}
						optionsError={optionsErrorMessage}
						profileError={errors.profile_joining?.message}
						contactInfoError={errors.contactInfo?.message}
						showContactInfo={showContactInfo}
						onOptionChange={handleOptionChange}
						onSubmit={handleSubmit(handleJoinSubmit, handleInvalidSubmit)}
						submitLabel={isSubmitting ? "Requesting..." : "Request To Join"}
					/>
				</FormProvider>
			)}
		</PanelLayout>
	);
};

export default LeagueJoin;
