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
import TextInput from "../../components/Forms/TextInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * TechType Form page component
 * @returns TechType Form page component
 */
function TechTypeForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.TechType.create(d);
      else result = await horizonApiClient.TechType.update(d);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.techType") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.TechTypes] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.TechTypes, id] });
        else {
          reset({
            id: undefined,
            name: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.techType") });
    }
    setSaving(false);
  };

  const techTypeQuery = useQuery({
    queryKey: [ReactQueryKeys.TechTypes, id],
    queryFn: () => horizonApiClient.TechType.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = techTypeQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [techTypeQuery]);

  useEffect(() => {
    if (techTypeQuery.data) {
      //* PARSING CONTENT
      if (techTypeQuery.data?.description && typeof techTypeQuery.data?.description === "string") {
        const html = techTypeQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(
            descriptionBlock.descriptionBlocks,
          );
          const editorState = EditorState.createWithContent(descriptionState);
          techTypeQuery.data.description = editorState;
        }
      }
      setLastUpdate(techTypeQuery?.data?.lastUpdate);
      reset({ ...techTypeQuery.data });
    }

    if (!id) {
      reset({
        id: undefined,
        name: "",
        baseFactor: 0,
        description: "",
      });
    }
  }, [techTypeQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:techTypes.editForm")} ${id}` : t("_pages:techTypes.newForm")}
        </h1>
        {techTypeQuery.isLoading ? (
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
        {/* TechType Name */}
        <Controller
          control={control}
          disabled={techTypeQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="text-input peer"
              placeholder={t("_entities:techType.name.placeholder")}
              label={t("_entities:techType.name.label")}
              required
            />
          )}
        />

        <button type="submit" disabled={techTypeQuery.isLoading || saving} className="my-5 submit">
          {(techTypeQuery.isLoading || saving) && (
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

export default TechTypeForm;
