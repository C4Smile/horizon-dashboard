import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import loadable from "@loadable/component";

// @sito/dashboard-app
import { Loading, TextInput, SelectInput } from "@sito/dashboard-app";

// editor

// components
import { ImageFormType, ImageUploader } from "components";

// providers
import { useNotification, queryClient, useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys, toEditorState } from "utils";
import { FormValues, NotificationEnumType } from "lib";
import { TechDto } from "../../lib";
import { HTTPError, parseId } from "api";

// loadable
const HtmlInput = loadable(() =>
  import("components").then((module) => ({
    default: module.HtmlInput,
  })),
);

/** the query this tab reads its record from */
type GeneralInfoPropsType = {
  techQuery: UseQueryResult<TechDto>;
};

/**
 * General Info
 * @param props - component props
 * @returns GeneralInfo
 */
export function GeneralInfo(props: GeneralInfoPropsType) {
  const { t } = useTranslation();

  const { techQuery } = props;

  const horizonApiClient = useHorizonApiClient();

  const { showNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setLastUpdate] = useState<string>("");

  const { handleSubmit, reset, control, getValues } = useForm<FormValues<TechDto>>();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const typesQuery = useQuery({
    queryKey: [ReactQueryKeys.TechTypes],
    queryFn: () => horizonApiClient.TechType.get(),
  });

  const typesList = useMemo(() => {
    try {
      return (
        typesQuery?.data?.items?.map((c) => ({
          value: c.name,
          id: c.id,
        })) ?? []
      );
    } catch (err: unknown) {
      console.error(err);
      return [];
    }
  }, [typesQuery.data]);

  const onSubmit = async (d: FormValues<TechDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Tech.createFromForm(d, photo);
      else result = await horizonApiClient.Tech.updateFromForm(d, photo);

      const { error, status } = result;
      if (!error)
        showNotification({
          message: t(`_accessibility:messages.${String(status)}`, {
            model: t("_entities:entities.tech"),
          }),
          type: NotificationEnumType.success,
        });
      setLastUpdate(new Date().toDateString());

      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Techs],
        });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Techs, id],
          });
        else {
          setPhoto(null);
          reset({
            id: undefined,
            name: "",
            creationTime: 0,
            description: "",
          });
        }
      }
    } catch (e: unknown) {
      console.error(e);
      showNotification({
        message: t(
          `_accessibility:messages.${String((e as HTTPError).status)}`,
          {
            model: t("_entities:entities.tech"),
          },
        ),
        type: NotificationEnumType.error,
      });
    }
    setSaving(false);
  };

  useEffect(() => {
    if (techQuery.data) {
      //* PARSING PHOTO
      setPhoto(techQuery.data?.image ?? null);

      setLastUpdate(String(techQuery?.data?.updatedAt ?? ""));
      // the api stores html, the input edits draft state; the query
      // cache is left alone
      reset({
        ...techQuery.data,
        description: toEditorState(techQuery.data.description),
      });
    }

    if (!techQuery.data?.id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        creationTime: 0,
        description: "",
      });
    }
  }, [techQuery.data, reset]);

  const id = getValues("id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-5 gap-5">
      {techQuery.isLoading ? (
        <Loading
          className="bg-none w-6 h-6 mb-10"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      ) : id ? (
        <>
          <div className={updatedAt.length ? "" : "mt-5"}>
            {!!updatedAt.length && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.updatedAt")}{" "}
                {new Date(updatedAt).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        </>
      ) : null}

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
            type="number"
            name="creationTime"
            id="creationTime"
            placeholder={t("_entities:tech.creationTime.placeholder")}
            label={t("_entities:tech.creationTime.label")}
            required
          />
        )}
      />

      {/* Tech Type */}
      <Controller
        control={control}
        name="type"
        disabled={techQuery.isLoading || typesQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            {...rest}
            id="type"
            name="type"
            label={t("_entities:tech.type.label")}
            options={typesList}
            value={parseId(value)}
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
            label={t("_entities:tech.image.label")}
            folder={ReactQueryKeys.Techs}
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

      <button
        type="submit"
        disabled={techQuery.isLoading || saving}
        className="my-5 submit"
      >
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
  );
}

export default GeneralInfo;
