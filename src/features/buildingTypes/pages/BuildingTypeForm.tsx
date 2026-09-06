import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// @sito/dashboard-app
import { Loading, TextInput } from "@sito/dashboard-app";

// components
import { ImageFormType, ImageUploader } from "components";

// providers
import { useNotification, queryClient, useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "utils";

// api
import { isHttpRequestError } from "api";

// lib
import { BuildingTypeDto } from "../lib";
import { FormValues } from "lib";

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

/**
 * BuildingType Form page component
 * @returns BuildingType Form page component
 */
function BuildingTypeForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const { handleSubmit, reset, control } = useForm<FormValues<BuildingTypeDto>>();

  const onSubmit = async (d: FormValues<BuildingTypeDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.BuildingType.createFromForm(d, photo);
      else result = await horizonApiClient.BuildingType.updateFromForm(d, photo);

      const { error, status } = result;
      setNotification(String(status), {
        model: t("_entities:entities.buildingType"),
      });
      setUpdatedAt(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.BuildingTypes],
        });
        if (id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.BuildingTypes, id],
          });
        else {
          setPhoto(null);
          reset({
            id: undefined,
            name: "",
          });
        }
      }
    } catch (e: unknown) {
      console.error(e);
      setNotification(isHttpRequestError(e) ? String(e.status) : "notConnected", {
        model: t("_entities:entities.buildingType"),
      });
    }
    setSaving(false);
  };

  const buildingTypeQuery = useQuery({
    queryKey: [ReactQueryKeys.BuildingTypes, id],
    queryFn: () => horizonApiClient.BuildingType.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = buildingTypeQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [buildingTypeQuery]);

  useEffect(() => {
    if (buildingTypeQuery.data) {
      //* PARSING PHOTO
      setPhoto(buildingTypeQuery.data?.image);

      setUpdatedAt(buildingTypeQuery?.data?.updatedAt);
      reset({ ...buildingTypeQuery.data });
    }

    if (!id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
      });
    }
  }, [buildingTypeQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id
            ? `${t("_accessibility:components.form.editing")} ${id}`
            : t("_pages:buildingTypes.newForm")}
        </h1>
        {buildingTypeQuery.isLoading ? (
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

        {/* BuildingType Name */}
        <Controller
          control={control}
          disabled={buildingTypeQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              id="name"
              placeholder={t("_entities:buildingType.name.placeholder")}
              label={t("_entities:buildingType.name.label")}
              required
            />
          )}
        />

        {/* Building Image */}
        <div className="my-5">
          {buildingTypeQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={t("_entities:buildingType.image.label")}
              folder={ReactQueryKeys.BuildingTypes}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={buildingTypeQuery.isLoading || saving}
          className="my-5 submit"
        >
          {(buildingTypeQuery.isLoading || saving) && (
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

export default BuildingTypeForm;
