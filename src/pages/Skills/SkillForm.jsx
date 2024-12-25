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
 * Skill Form page component
 * @returns Skill Form page component
 */
function SkillForm() {
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
      if (!d.id) result = await horizonApiClient.Skill.create(d, photo);
      else result = await horizonApiClient.Skill.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.skill") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Skills] });
        if (id !== undefined)
          await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Skills, id] });
        else {
          setPhoto();
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
      setNotification(String(e.status), { model: t("_entities:entities.skill") });
    }
    setSaving(false);
  };

  const skillQuery = useQuery({
    queryKey: [ReactQueryKeys.Skills, id],
    queryFn: () => horizonApiClient.Skill.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = skillQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [skillQuery]);

  useEffect(() => {
    if (skillQuery.data) {
      //* PARSING PHOTO
      setPhoto(skillQuery.data?.image);

      //* PARSING CONTENT
      if (skillQuery.data?.description && typeof skillQuery.data?.description === "string") {
        const html = skillQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(descriptionBlock);
          skillQuery.data.description = EditorState.createWithContent(descriptionState);
        }
      }
      setLastUpdate(skillQuery?.data?.lastUpdate);
      reset({ ...skillQuery.data });
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
  }, [skillQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_accessibility:components.form.editing")} ${id}` : t("_pages:skills.newForm")}
        </h1>
        {skillQuery.isLoading ? (
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
        {/* Skill Name */}
        <Controller
          control={control}
          disabled={skillQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="text-input peer"
              placeholder={t("_entities:skill.name.placeholder")}
              label={t("_entities:skill.name.label")}
              required
            />
          )}
        />
        {/* Skill Image */}
        <div className="my-5">
          {skillQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={`${t("_entities:skill.image.label")}`}
              folder={`${ReactQueryKeys.Skills}`}
            />
          )}
        </div>
        {/* Skill description */}
        <Controller
          control={control}
          name="description"
          disabled={skillQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:skill.description.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <button type="submit" disabled={skillQuery.isLoading || saving} className="my-5 submit">
          {(skillQuery.isLoading || saving) && (
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

export default SkillForm;
