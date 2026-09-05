import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// lib
import { FormValues, BuildingDto } from "lib";
import type { UseQueryResult } from "@tanstack/react-query";

// api
import { isHttpRequestError } from "api";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import loadable from "@loadable/component";

// @sito/dashboard-app
import { Loading, SelectInput, TextInput } from "@sito/dashboard-app";

// utils
import { toEditorState } from "utils";

// editor

// components
import { ImageFormType, ImageUploader } from "components";

// providers
import { useNotification, queryClient, useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "../../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() =>
  import("components").then((module) => ({
    default: module.HtmlInput,
  })),
);

/** the query this tab reads its record from */
type GeneralInfoPropsType = {
  buildingQuery: UseQueryResult<BuildingDto>;
};

/**
 * General Info
 * @param {*} props - component props
 * @returns GeneralInfo
 */
function GeneralInfo(props: GeneralInfoPropsType) {
  const { t } = useTranslation();

  const { buildingQuery } = props;

  const horizonApiClient = useHorizonApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setLastUpdate] = useState<string | Date | undefined>();

  const { handleSubmit, reset, control, getValues } = useForm<FormValues<BuildingDto>>();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const typesQuery = useQuery({
    queryKey: [ReactQueryKeys.BuildingTypes],
    queryFn: () => horizonApiClient.BuildingType.getAll(),
  });

  const typesList = useMemo(() => {
    try {
      return (
        typesQuery?.data?.items?.map((c) => ({
          value: c.name,
          id: c.id,
        })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [typesQuery.data]);

  const onSubmit = async (d: FormValues<BuildingDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Building.createFromForm(d, photo);
      else result = await horizonApiClient.Building.updateFromForm(d, photo);

      const { error, status } = result;
      setNotification(String(status), {
        model: t("_entities:entities.building"),
        },
      );
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error !== null && error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Buildings],
        });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Buildings, id],
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
      setNotification(
        isHttpRequestError(e) ? String(e.status) : "notConnected",
        {
        model: t("_entities:entities.building"),
        },
      );
    }
    setSaving(false);
  };

  useEffect(() => {
    if (buildingQuery.data) {
      //* PARSING PHOTO
      setPhoto(buildingQuery.data?.image);

      setLastUpdate(buildingQuery?.data?.updatedAt);
      // the api stores html, the input edits draft state; the query
      // cache is left alone
      reset({
        ...buildingQuery.data,
        description: toEditorState(buildingQuery.data.description),
      });
    }

    if (!buildingQuery.data?.id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        creationTime: 0,
        description: "",
      });
    }
  }, [buildingQuery.data, reset]);

  const id = getValues("id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-5 gap-5">
      {buildingQuery.isLoading ? (
        <Loading
          className="bg-none w-6 h-6 mb-10"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      ) : id ? (
        <>
          <div className={updatedAt?.length ? "" : "mt-5"}>
            {updatedAt?.length && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.updatedAt")}{" "}
                {new Date(updatedAt).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        </>
      ) : null}

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
            placeholder={t("_entities:building.name.placeholder")}
            label={t("_entities:building.name.label")}
            required
          />
        )}
      />

      {/* Building Creation Time */}
      <Controller
        control={control}
        disabled={buildingQuery.isLoading || saving}
        name="creationTime"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="creationTime"
            id="creationTime"
            placeholder={t("_entities:building.creationTime.placeholder")}
            label={t("_entities:building.creationTime.label")}
            required
          />
        )}
      />

      {/* Building Type */}
      <Controller
        control={control}
        name="type"
        disabled={buildingQuery.isLoading || typesQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            {...rest}
            id="type"
            name="type"
            label={t("_entities:building.type.label")}
            options={typesList}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}
      />

      {/* Building Image */}
      <div className="my-5">
        {buildingQuery.isLoading ? (
          <Loading />
        ) : (
          <ImageUploader
            photo={photo}
            setPhoto={setPhoto}
            label={t("_entities:building.image.label")}
            folder={ReactQueryKeys.Buildings}
          />
        )}
      </div>

      {/* Building description */}
      <Controller
        control={control}
        name="description"
        disabled={buildingQuery.isLoading || saving}
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

      <button
        type="submit"
        disabled={buildingQuery.isLoading || saving}
        className="my-5 submit"
      >
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
  );
}

export default GeneralInfo;
