import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Button/Button";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import TextAreaInput from "@/components/Inputs/TextAreaInput/TextAreaInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import {
  ColumnText,
  ExtraCell,
  ExtraColumn,
  PointsCell,
  PointsColumn,
  PositionCell,
  PositionColumn,
  ResultHeader,
  TableBody,
  TableRow,
  TableWrapper,
} from "./OverviewForm.styles";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import {
  useAddLeagueSeasonChampPoints,
  useAddLeagueSeasonContentBlock,
  useRemoveLeagueSeasonChampPoints,
  useRemoveLeagueSeasonContentBlock,
  useUpdateLeagueSeason,
  useUpdateLeagueSeasonChampPoints,
  useUpdateLeagueSeasonContentBlock,
} from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import {
  useLeagueSeasonChampPoints,
  useLeagueSeasonContentBlocks,
} from "@/rtkQuery/hooks/queries/useLeagues";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import type { LeagueSeasonTable } from "@/types/league.types";
import type { RootState } from "@/store";
import FormContainerBlock from "@/components/Forms/FormContainerBlock/FormContainerBlock";
import SubFormBlock from "@/components/Forms/SubFormBlock/SubFormBlock";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import {
  overviewFormSchema,
  type OverviewFormValues,
} from "./overviewForm.schema";
import DefaultOverviewPoster from "@/assets/Overview/defaultOverview.png";
import DefaultContentPoster from "@/assets/Overview/defaultContent.png";
import {
  resolveLeagueSeasonPosterUrl,
  uploadLeagueSeasonPosterImage,
} from "@/services/league/leagueSeason.service";
import { uploadLeagueSeasonContentBlockImage } from "@/services/league/leagueSeasonContentBlock.service";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import CannotSave from "../../modals/errors/CannotSave/CannotSave";

type OverviewFormProps = {
  seasonData: LeagueSeasonTable;
  onDirtyChange: (dirty: boolean) => void;
};

const OverviewForm = ({ seasonData, onDirtyChange }: OverviewFormProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [openContentMenuId, setOpenContentMenuId] = useState<string | null>(
    null,
  );
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const contentBlocksQuery = useLeagueSeasonContentBlocks(seasonData.id);
  const champPointsQuery = useLeagueSeasonChampPoints(seasonData.id);
  const [updateLeagueSeason] = useUpdateLeagueSeason();
  const [addLeagueSeasonContentBlock] = useAddLeagueSeasonContentBlock();
  const [updateLeagueSeasonContentBlock] = useUpdateLeagueSeasonContentBlock();
  const [removeLeagueSeasonContentBlock] = useRemoveLeagueSeasonContentBlock();
  const [addLeagueSeasonChampPoints] = useAddLeagueSeasonChampPoints();
  const [updateLeagueSeasonChampPoints] = useUpdateLeagueSeasonChampPoints();
  const [removeLeagueSeasonChampPoints] = useRemoveLeagueSeasonChampPoints();

  // -- Helper Functions -- //
  const toPersistedImageUrl = (previewUrl?: string): string | undefined => {
    if (!previewUrl || previewUrl.trim().length === 0) {
      return undefined;
    }

    // Blob/data URLs are local previews and should never be persisted.
    if (previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")) {
      return undefined;
    }

    return previewUrl;
  };

  const resolvePosterUrl = async (
    poster: OverviewFormValues["poster"],
  ): Promise<string | undefined> => {
    if (poster?.type === "upload" && poster.file instanceof File) {
      if (!accountId) {
        throw new Error("Missing account id");
      }

      const uploadResult = await uploadLeagueSeasonPosterImage({
        accountId,
        seasonId: seasonData.id,
        file: poster.file,
      });

      if (!uploadResult.success) {
        throw new Error(uploadResult.error.message);
      }

      return uploadResult.data.src;
    }

    if (poster?.type === "upload") {
      return toPersistedImageUrl(poster.previewUrl) ?? seasonData.poster_url;
    }

    return seasonData.poster_url;
  };

  const resolvePosterPreviewUrl = (posterUrl?: string): string => {
    if (!posterUrl) {
      return DefaultOverviewPoster;
    }

    return resolveLeagueSeasonPosterUrl(posterUrl);
  };

  const updatePositionText = (index: number) => {
    if (index === 0) return "1st";
    if (index === 1) return "2nd";
    if (index === 2) return "3rd";
    return `${index + 1}th`;
  };

  // -- Memoized Values -- //
  const mappedContentBlockDefaults = useMemo(() => {
    if (!contentBlocksQuery.data || contentBlocksQuery.data.length === 0) {
      return [];
    }

    return contentBlocksQuery.data.map((block) => ({
      id: block.id,
      title: block.header,
      description: block.description ?? "",
      image: {
        type: "upload" as const,
        previewUrl: block.content_image_url,
      },
    }));
  }, [contentBlocksQuery.data]);

  const mappedChampPointsDefaults = useMemo(() => {
    if (!champPointsQuery.data || champPointsQuery.data.length === 0) {
      return [];
    }

    return champPointsQuery.data
      .slice()
      .sort((a, b) => {
        return a.position - b.position;
      })
      .map((row) => ({
        id: row.id,
        points: String(row.points ?? "1"),
      }));
  }, [champPointsQuery.data]);

  // -- Form Setup -- //
  const formMethods = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewFormSchema),
    defaultValues: {
      poster: {
        type: "upload",
        previewUrl: resolvePosterPreviewUrl(seasonData.poster_url),
      },
      contentBlocks: mappedContentBlockDefaults,
      championshipPoints: mappedChampPointsDefaults,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = formMethods;

  const {
    fields: contentBlockFields,
    append: appendContentBlock,
    remove: removeContentBlock,
  } = useFieldArray({
    control,
    name: "contentBlocks",
  });

  const {
    fields: champPointFields,
    append: appendChampPoint,
    remove: removeChampPoint,
  } = useFieldArray({
    control,
    name: "championshipPoints",
  });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    reset({
      poster: {
        type: "upload",
        previewUrl: resolvePosterPreviewUrl(seasonData.poster_url),
      },
      contentBlocks: mappedContentBlockDefaults,
      championshipPoints: mappedChampPointsDefaults,
    });
  }, [
    mappedChampPointsDefaults,
    mappedContentBlockDefaults,
    reset,
    seasonData.poster_url,
  ]);

  // -- Contents -- //

  const headerChildren = (
    <ImageUploadInput
      name="poster"
      helperMessage="JPG or PNG up to 5MB"
      defaultImageSrc={DefaultOverviewPoster}
    />
  );

  const listChildren = (
    <>
      <FormContainerBlock
        title={"Content Blocks"}
        addItem={{
          label: "Add New Content Block",
          onClick: () => {
            appendContentBlock({
              title: "",
              description: "",
              image: {
                type: "upload",
              },
            });
          },
        }}
      >
        <>
          {contentBlockFields.map((field, index) => (
            <SubFormBlock
              title={`Block ${index + 1}`}
              key={field.id}
              moreOptions
              moreOnClick={() => {
                setOpenContentMenuId((currentMenuId) =>
                  currentMenuId === field.id ? null : field.id,
                );
              }}
              moreMenu={
                openContentMenuId === field.id ? (
                  <MenuDropdown
                    type={"text"}
                    isStandAlone={true}
                    options={[
                      {
                        label: "Remove",
                        value: "remove",
                        icon: <DeleteIcon />,
                      },
                    ]}
                    onSelect={() => {
                      removeContentBlock(index);
                      setOpenContentMenuId(null);
                    }}
                  />
                ) : undefined
              }
            >
              <ImageUploadInput
                name={`contentBlocks.${index}.image`}
                helperMessage="JPG or PNG up to 5MB"
                defaultImageSrc={DefaultContentPoster}
              />
              <TextInput
                name={`contentBlocks.${index}.title`}
                label="Header"
                placeholder="Content Block Title"
                maxLength={80}
                hasError={!!errors.contentBlocks?.[index]?.title}
                errorMessage={errors.contentBlocks?.[index]?.title?.message}
                showCounter
              />
              <TextAreaInput
                name={`contentBlocks.${index}.description`}
                label="Body"
                placeholder="Enter some text here to provide extra information about this season. The content blocks in the overview tab are unique for each season, along with the poster image."
                rows={4}
                maxLength={360}
                hasError={!!errors.contentBlocks?.[index]?.description}
                errorMessage={
                  errors.contentBlocks?.[index]?.description?.message
                }
                showCounter
              />
            </SubFormBlock>
          ))}
        </>
      </FormContainerBlock>

      <FormContainerBlock
        title={"Championship Points"}
        addItem={{
          label: "Add Points Position",
          onClick: () => {
            appendChampPoint({ points: "1" });
          },
        }}
      >
        {champPointFields.length > 0 && (
          <TableWrapper>
            <ResultHeader>
              <TableRow>
                <PositionColumn>
                  <ColumnText>Position</ColumnText>
                </PositionColumn>
                <PointsColumn>
                  <ColumnText>Points</ColumnText>
                </PointsColumn>
                <ExtraColumn>
                  <ColumnText> </ColumnText>
                </ExtraColumn>
              </TableRow>
            </ResultHeader>
            <TableBody>
              {champPointFields.map((field, index) => (
                <TableRow key={field.id}>
                  <PositionCell>
                    <ReadOnlyInput textValue={updatePositionText(index)} />
                  </PositionCell>
                  <PointsCell>
                    <TextInput
                      name={`championshipPoints.${index}.points`}
                      type="number"
                      placeholder="0"
                    />
                  </PointsCell>
                  <ExtraCell>
                    <Button
                      size="small"
                      color="base"
                      icon={{ left: <RemoveIcon /> }}
                      onClick={() => removeChampPoint(index)}
                      ariaLabel={`Remove points row ${index + 1}`}
                    />
                  </ExtraCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </FormContainerBlock>
    </>
  );
  console.log(errors, "errors");

  // -- Handlers -- //

  // Sync Content Blocks (Add/Update/Delete)
  const syncContentBlocks = async (
    contentBlocks: OverviewFormValues["contentBlocks"],
  ): Promise<OverviewFormValues["contentBlocks"]> => {
    const remainingContentBlockIds = new Set(
      (contentBlocksQuery.data ?? []).map((block) => block.id),
    );
    const savedContentBlocks: OverviewFormValues["contentBlocks"] = [];

    for (let index = 0; index < contentBlocks.length; index += 1) {
      const contentBlock = contentBlocks[index];
      const title = contentBlock.title.trim() || `Content Block ${index + 1}`;
      const description = contentBlock.description.trim();

      let contentImageUrl: string | undefined;

      if (
        contentBlock.image?.type === "upload" &&
        contentBlock.image.file instanceof File
      ) {
        if (!accountId) {
          throw new Error("Missing account id");
        }

        const uploadResult = await uploadLeagueSeasonContentBlockImage({
          accountId,
          seasonId: seasonData.id,
          file: contentBlock.image.file,
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error.message);
        }

        contentImageUrl = uploadResult.data.src;
      } else if (contentBlock.image?.type === "upload") {
        contentImageUrl = toPersistedImageUrl(contentBlock.image.previewUrl);
      }

      if (contentBlock.id) {
        remainingContentBlockIds.delete(contentBlock.id);

        const updateResult = await updateLeagueSeasonContentBlock({
          contentBlockId: contentBlock.id,
          seasonId: seasonData.id,
          header: title,
          description,
          contentImageUrl,
        }).unwrap();

        if (!updateResult.success) {
          throw new Error("Failed to update content block.");
        }

        savedContentBlocks.push({
          id: updateResult.data.id,
          title: updateResult.data.header,
          description: updateResult.data.description ?? "",
          image: {
            type: "upload",
            previewUrl: updateResult.data.content_image_url,
          },
        });
        continue;
      }

      const addResult = await addLeagueSeasonContentBlock({
        seasonId: seasonData.id,
        leagueId: seasonData.league_id,
        header: title,
        description,
        contentImageUrl,
      }).unwrap();

      if (!addResult.success) {
        throw new Error("Failed to add content block.");
      }

      savedContentBlocks.push({
        id: addResult.data.id,
        title: addResult.data.header,
        description: addResult.data.description ?? "",
        image: {
          type: "upload",
          previewUrl: addResult.data.content_image_url,
        },
      });
    }

    for (const contentBlockId of remainingContentBlockIds) {
      const removeResult = await removeLeagueSeasonContentBlock({
        contentBlockId,
        seasonId: seasonData.id,
      }).unwrap();

      if (!removeResult.success) {
        throw new Error("Failed to remove content block.");
      }
    }

    return savedContentBlocks;
  };

  // Sync Championship Points (Add/Update/Delete)
  const syncChampionshipPoints = async (
    championshipPoints: OverviewFormValues["championshipPoints"],
  ): Promise<OverviewFormValues["championshipPoints"]> => {
    const remainingChampPointIds = new Set(
      (champPointsQuery.data ?? []).map((point) => point.id),
    );
    const savedChampPoints: OverviewFormValues["championshipPoints"] = [];

    for (let index = 0; index < championshipPoints.length; index += 1) {
      const champPoint = championshipPoints[index];
      const position = index + 1;
      const points = String(champPoint.points ?? "").trim();

      if (champPoint.id) {
        remainingChampPointIds.delete(champPoint.id);

        const updateResult = await updateLeagueSeasonChampPoints({
          champPointsId: champPoint.id,
          seasonId: seasonData.id,
          position,
          points,
        }).unwrap();

        if (!updateResult.success) {
          throw new Error("Failed to update championship points row.");
        }

        savedChampPoints.push({
          id: updateResult.data.id,
          points: String(updateResult.data.points ?? "1"),
        });
        continue;
      }

      const addResult = await addLeagueSeasonChampPoints({
        seasonId: seasonData.id,
        leagueId: seasonData.league_id,
        position,
        points,
      }).unwrap();

      if (!addResult.success) {
        throw new Error("Failed to add championship points row.");
      }

      savedChampPoints.push({
        id: addResult.data.id,
        points: String(addResult.data.points ?? "1"),
      });
    }

    for (const champPointsId of remainingChampPointIds) {
      const removeResult = await removeLeagueSeasonChampPoints({
        champPointsId,
        seasonId: seasonData.id,
      }).unwrap();

      if (!removeResult.success) {
        throw new Error("Failed to remove championship points row.");
      }
    }

    return savedChampPoints;
  };

  // Handle Invalid Form Submission
  const handleOnInvalidSubmit = () => {
    console.error("Form submission failed due to validation errors.", errors);
    openModal(<CannotSave />);
    return;
  };

  // Handle Form Submission
  const handleOnSubmit = async (data: OverviewFormValues) => {
    setIsSaving(true);

    try {
      const posterUrl = await resolvePosterUrl(data.poster);

      const result = await updateLeagueSeason({
        seasonId: seasonData.id,
        seasonName: seasonData.season_name,
        seasonStatus: seasonData.season_status,
        posterUrl,
      }).unwrap();

      if (!result.success) {
        throw new Error("Failed to update season poster.");
      }

      const [savedContentBlocks, savedChampPoints] = await Promise.all([
        syncContentBlocks(data.contentBlocks),
        syncChampionshipPoints(data.championshipPoints),
      ]);

      reset({
        poster: {
          type: "upload",
          previewUrl: resolvePosterPreviewUrl(result.data.poster_url),
        },
        contentBlocks: savedContentBlocks.length > 0 ? savedContentBlocks : [],
        championshipPoints: savedChampPoints.length > 0 ? savedChampPoints : [],
      });

      showToast({
        usage: "success",
        message: "Overview updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = handleSubmit(handleOnSubmit, handleOnInvalidSubmit);

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={"overview"}
        seasonName={seasonData.season_name}
        blockHeader={"Season Poster"}
        blockDescription={
          "This is the main image displayed on the Overview page."
        }
        header={"Overview Page"}
        headerChildren={headerChildren}
        listChildren={listChildren}
        onSave={onSave}
        isSaving={
          isSaving ||
          isSubmitting ||
          contentBlocksQuery.isFetching ||
          champPointsQuery.isFetching
        }
        saveLoadingText="Saving Overview..."
      />
    </FormProvider>
  );
};

export default OverviewForm;
