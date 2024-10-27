import { useEffect, useMemo, useState } from "react";
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
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";
import ImageUploader from "../../components/ImageUploader";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Tech Form page component
 * @returns Tech Form page component
 */
function TechForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photo, setPhoto] = useState();

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Tech.create(d, photo);
      else result = await horizonApiClient.Tech.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.tech") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Techs] });
        if (id !== undefined) queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Techs, id] });
        else {
          setPhoto();
          reset({
            id: undefined,
            name: "",
            creationTime: 0,
            description: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.tech") });
    }
    setSaving(false);
  };

  const techQuery = useQuery({
    queryKey: [ReactQueryKeys.Techs, id],
    queryFn: () => horizonApiClient.Tech.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = techQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [techQuery]);

  const typesQuery = useQuery({
    queryKey: [ReactQueryKeys.TechTypes],
    queryFn: () => horizonApiClient.TechType.getAll(),
  });

  const typesList = useMemo(() => {
    try {
      return typesQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [typesQuery.data]);

  useEffect(() => {
    if (techQuery.data) {
      //* PARSING PHOTO
      setPhoto(techQuery.data?.techHasImage.imageId);

      //* PARSING CONTENT
      if (techQuery.data?.description && typeof techQuery.data?.description === "string") {
        const html = techQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(
            descriptionBlock.descriptionBlocks,
          );
          const editorState = EditorState.createWithContent(descriptionState);
          techQuery.data.description = editorState;
        }
      }
      setLastUpdate(techQuery?.data?.lastUpdate);
      reset({ ...techQuery.data });
    }

    if (!id) {
      setPhoto();
      reset({
        id: undefined,
        name: "",
        creationTime: 0,
        description: "",
      });
    }
  }, [techQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:techs.editForm")} ${id}` : t("_pages:techs.newForm")}
        </h1>

        {techQuery.isLoading ? (
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

        {/* Tech Name */}
        <Controller
          control={control}
          disabled={techQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="text-input peer"
              placeholder={t("_entities:tech.name.placeholder")}
              label={t("_entities:tech.name.label")}
              required
            />
          )}
        />

        {/* Tech Creation Time */}
        <Controller
          control={control}
          disabled={techQuery.isLoading || saving}
          name="creationTime"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="creationTime"
              id="creationTime"
              className="text-input peer"
              placeholder={t("_entities:tech.creationTime.placeholder")}
              label={t("_entities:tech.creationTime.label")}
              required
            />
          )}
        />

        {/* Tech Type */}
        <Controller
          control={control}
          name="typeId"
          disabled={techQuery.isLoading || typesQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="typeId"
              name="typeId"
              label={t("_entities:tech.typeId.label")}
              options={typesList}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />

        {/* Tech Image */}
        <div className="my-5">
          {techQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={`${t("_entities:tech.imageId.label")}`}
              folder={`${ReactQueryKeys.Techs}`}
            />
          )}
        </div>

        {/* Tech description */}
        <Controller
          control={control}
          name="description"
          disabled={techQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:tech.description.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <button type="submit" disabled={techQuery.isLoading || saving} className="my-5 submit">
          {(techQuery.isLoading || saving) && (
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

export default TechForm;
