import { useEffect, useState } from "react";
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
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const TextInput = loadable(() => import("../../components/Forms/TextInput"));
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));
const ImageUploader = loadable(() => import("../../components/ImageUploader"));

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Resource Form page component
 * @returns Resource Form page component
 */
function ResourceForm() {
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
      if (!d.id) result = await horizonApiClient.Resource.create(d, photo);
      else result = await horizonApiClient.Resource.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.resource") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Resources] });
        if (id !== undefined)
          await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Resources, id] });
        else {
          setPhoto(null);
          reset({
            id: undefined,
            name: "",
            baseFactor: 0,
            description: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.resource") });
    }
    setSaving(false);
  };

  const resourceQuery = useQuery({
    queryKey: [ReactQueryKeys.Resources, id],
    queryFn: () => horizonApiClient.Resource.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = resourceQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [resourceQuery]);

  useEffect(() => {
    if (resourceQuery.data) {
      //* PARSING PHOTO
      setPhoto(resourceQuery.data?.image);
      //* PARSING CONTENT
      if (resourceQuery.data?.description && typeof resourceQuery.data?.description === "string") {
        const html = resourceQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(descriptionBlock);
          resourceQuery.data.description = EditorState.createWithContent(descriptionState);
        }
      }
      setLastUpdate(resourceQuery?.data?.lastUpdate);
      reset({ ...resourceQuery.data });
    }

    if (!id) {
      setPhoto();
      reset({
        id: undefined,
        name: "",
        baseFactor: 0,
        description: "",
      });
    }
  }, [resourceQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:resources.editForm")} ${id}` : t("_pages:resources.newForm")}
        </h1>
        {resourceQuery.isLoading ? (
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
        {/* Resource Name */}
        <Controller
          control={control}
          disabled={resourceQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="text-input peer"
              placeholder={t("_entities:resource.name.placeholder")}
              label={t("_entities:resource.name.label")}
              required
            />
          )}
        />
        {/* Resource Base Factor */}
        <Controller
          control={control}
          disabled={resourceQuery.isLoading || saving}
          name="baseFactor"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="baseFactor"
              id="baseFactor"
              className="text-input peer"
              placeholder={t("_entities:resource.baseFactor.placeholder")}
              label={t("_entities:resource.baseFactor.label")}
              required
            />
          )}
        />

        {/* Resource Image */}
        <div className="my-5">
          {resourceQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={`${t("_entities:resource.image.label")}`}
              folder={`${ReactQueryKeys.Resources}`}
            />
          )}
        </div>
        {/* Resource description */}
        <Controller
          control={control}
          name="description"
          disabled={resourceQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:resource.description.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <button type="submit" disabled={resourceQuery.isLoading || saving} className="my-5 submit">
          {(resourceQuery.isLoading || saving) && (
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

export default ResourceForm;
