import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// lib
import { FormValues } from "lib";
import { SkillDto } from "../lib";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// utils
import { toEditorState } from "utils";

// editor

// @sito/dashboard-app
import { Loading, TextInput } from "@sito/dashboard-app";

// components
import { ImageFormType, ImageUploader, FormTitle, SaveFab } from "components";

// providers
import { useNotification, queryClient, useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "utils/queryKeys";

// api
import { isHttpRequestError } from "api";

// loadable
const HtmlInput = loadable(() =>
  import("components").then((module) => ({
    default: module.HtmlInput,
  })),
);

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

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
  const [updatedAt, setLastUpdate] = useState<string>("");

  const { handleSubmit, reset, control } = useForm<FormValues<SkillDto>>();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const onSubmit = async (d: FormValues<SkillDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Skill.createFromForm(d, photo);
      else result = await horizonApiClient.Skill.updateFromForm(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.skill") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Skills],
        });
        if (id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Skills, id],
          });
        else {
          setPhoto(null);
          reset({
            id: undefined,
            name: "",
            description: "",
          });
        }
      }
    } catch (e: unknown) {
      console.error(e);
      setNotification(
        isHttpRequestError(e) ? String(e.status) : "notConnected",
        {
          model: t("_entities:entities.skill"),
        },
      );
    }
    setSaving(false);
  };

  const skillQuery = useQuery({
    queryKey: [ReactQueryKeys.Skills, id],
    queryFn: () => horizonApiClient.Skill.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = skillQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [skillQuery]);

  useEffect(() => {
    if (skillQuery.data) {
      //* PARSING PHOTO
      setPhoto(skillQuery.data?.image);

      setLastUpdate(String(skillQuery?.data?.updatedAt ?? ""));
      // the api stores html, the input edits draft state; the query
      // cache is left alone
      reset({
        ...skillQuery.data,
        description: toEditorState(skillQuery.data.description),
      });
    }

    if (!id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        description: "",
      });
    }
  }, [skillQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormTitle>
          {id
            ? `${t("_accessibility:components.form.editing")} ${
                skillQuery.data?.name ?? id
              }`
            : t("_pages:skills.newForm")}
        </FormTitle>
        {skillQuery.isLoading ? (
          <Loading
            className="bg-none w-6 h-6 mb-10"
            strokeWidth="4"
            loaderClass="!w-6"
            color="stroke-primary"
          />
        ) : (
          <div className={id && updatedAt ? "" : "mt-5"}>
            {id && updatedAt && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.updatedAt")}{" "}
                {new Date(updatedAt).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        )}
        {/* Skill Image */}
        <div className="my-5">
          {skillQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={t("_entities:skill.image.label")}
              folder={ReactQueryKeys.Skills}
            />
          )}
        </div>
        {/* Skill Name */}
        <Controller
          control={control}
          disabled={skillQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              id="name"
              placeholder={t("_entities:skill.name.placeholder")}
              label={t("_entities:skill.name.label")}
              required
            />
          )}
        />
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

        <SaveFab
          disabled={skillQuery.isLoading || saving}
          loading={skillQuery.isLoading || saving}
        />
      </form>
    </div>
  );
}

export default SkillForm;
