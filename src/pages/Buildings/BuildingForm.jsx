import { useEffect, useMemo, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// editor
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

// components
import Loading from "../../partials/loading/Loading";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../providers/HorizonApiProvider";

// utils
import { localPhotoReducer } from "../../components/utils";
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const TextInput = loadable(() => import("../../components/Forms/TextInput"));
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));
const AutocompleteInput = loadable(() => import("../../components/Forms/AutocompleteInput"));
const ImageUploaderMultiple = loadable(() => import("../../components/ImageUploaderMultiple"));

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Building Form page component
 * @returns Building Form page component
 */
function BuildingForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photos, setPhotos] = useReducer(localPhotoReducer, []);

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Building.create(d, photos);
      else result = await horizonApiClient.Building.update(d, photos);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.building") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Building] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Building, id] });
        else {
          setPhotos({ type: "set", items: [] });
          reset({
            id: undefined,
            name: "",
            subname: "",
            tagsId: [],
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.building") });
    }
    setSaving(false);
  };

  const buildingQuery = useQuery({
    queryKey: [ReactQueryKeys.Building, id],
    queryFn: () => horizonApiClient.Building.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = buildingQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [buildingQuery]);

  useEffect(() => {
    if (buildingQuery.data?.buildingHasImage?.length)
      setPhotos({
        type: "set",
        items: buildingQuery.data?.buildingHasImage.map((image) => image.imageId),
      });

    if (!id) {
      setPhotos({ type: "set", items: [] });
      reset({
        id: undefined,
        name: "",
        subname: "",
        tagsId: [],
      });
    }
  }, [buildingQuery.data, id, reset]);

  const tagsQuery = useQuery({
    queryKey: [ReactQueryKeys.Tags],
    queryFn: () => horizonApiClient.Tag.getAll(),
  });

  const tagsList = useMemo(() => {
    try {
      return tagsQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [tagsQuery.data]);

  useEffect(() => {
    if (buildingQuery.data) {
      //* PARSING TAGS
      const parsedTags = tagsList.filter((tag) =>
        buildingQuery?.data?.buildingHasTag?.some((lTag) => lTag.tagId.id === tag.id),
      );
      //* PARSING CONTENT
      if (buildingQuery.data?.description && typeof buildingQuery.data?.description === "string") {
        const html = buildingQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(descriptionBlock.descriptionBlocks);
          const editorState = EditorState.createWithContent(descriptionState);
          buildingQuery.data.description = editorState;
        }
      }
      setLastUpdate(buildingQuery?.data?.lastUpdate);
      reset({ ...buildingQuery.data, tagsId: parsedTags });
    }
  }, [tagsList, buildingQuery.data, reset]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:buildings.editForm")} ${id}` : t("_pages:buildings.newForm")}
        </h1>
        {buildingQuery.isLoading ? (
          <Loading
            className="bg-none w-6 h-6 mb-10"
            strokeWidth="4"
            loaderClass="!w-6"
            color="stroke-primary"
          />
        ) : (
          <div className={id && lastUpdate ? "" : "mt-5"}>
            {id && lastUpdate && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.lastUpdate")}{" "}
                {new Date(lastUpdate).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        )}
        {/* Building Name */}
        <Controller
          control={control}
          disabled={buildingQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="text-input peer"
              placeholder={t("_entities:building.name.placeholder")}
              label={t("_entities:building.name.label")}
              required
            />
          )}
        />

        {/* Building Tags */}
        <Controller
          control={control}
          name="tagsId"
          disabled={buildingQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <AutocompleteInput
              {...rest}
              id="tagsId"
              name="tagsId"
              label={t("_entities:building.buildingHasTag.label")}
              placeholder={t("_entities:building.buildingHasTag.placeholder")}
              options={tagsList}
              value={value}
              multiple
              onChange={(v) => {
                onChange(v);
              }}
            />
          )}
        />
        {/* Building Images */}
        <div className="my-5">
          {buildingQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploaderMultiple
              photos={photos}
              setPhotos={setPhotos}
              label={`${t("_entities:building.buildingHasImage.label")}`}
              folder={`${ReactQueryKeys.Building}`}
            />
          )}
        </div>
        {/* Building description */}
        <Controller
          control={control}
          name="description"
          disabled={buildingQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:building.description.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <button type="submit" disabled={buildingQuery.isLoading || saving} className="my-5 submit">
          {(buildingQuery.isLoading || saving) && (
            <Loading
              className="button-loading"
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          )}
          {t("_accessibility:buttons.save")}
        </button>
      </form>
    </div>
  );
}

export default BuildingForm;
