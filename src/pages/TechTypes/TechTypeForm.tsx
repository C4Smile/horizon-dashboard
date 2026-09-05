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
import { ReactQueryKeys } from "../../utils/queryKeys";

// api
import { isHttpRequestError } from "api";

// lib
import { FormValues, TechTypeDto } from "lib";

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
  const [updatedAt, setUpdatedAt] = useState<string | Date | undefined>();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const { handleSubmit, reset, control } = useForm<FormValues<TechTypeDto>>();

  const onSubmit = async (d: FormValues<TechTypeDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.TechType.createFromForm(d, photo);
      else result = await horizonApiClient.TechType.updateFromForm(d, photo);

      const { error, status } = result;
      setNotification(String(status), {
        model: t("_entities:entities.techType"),
      });
      setUpdatedAt(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.TechTypes],
        });
        if (id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.TechTypes, id],
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
        model: t("_entities:entities.techType"),
      });
    }
    setSaving(false);
  };

  const techTypeQuery = useQuery({
    queryKey: [ReactQueryKeys.TechTypes, id],
    queryFn: () => horizonApiClient.TechType.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = techTypeQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [techTypeQuery]);

  useEffect(() => {
    if (techTypeQuery.data) {
      //* PARSING PHOTO
      setPhoto(techTypeQuery.data?.image);

      setUpdatedAt(techTypeQuery?.data?.updatedAt);
      reset({ ...techTypeQuery.data });
    }

    if (!id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
      });
    }
  }, [techTypeQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id
            ? `${t("_accessibility:components.form.editing")} ${id}`
            : t("_pages:techTypes.newForm")}
        </h1>
        {techTypeQuery.isLoading ? (
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
                {t("_accessibility:labels.lastUpdate")}{" "}
                {new Date(updatedAt).toLocaleDateString("es-ES")}
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
              id="name"
              className="text-input peer"
              placeholder={t("_entities:techType.name.placeholder")}
              label={t("_entities:techType.name.label")}
              required
            />
          )}
        />

        {/* Tech Image */}
        <div className="my-5">
          {techTypeQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={t("_entities:techType.image.label")}
              folder={ReactQueryKeys.TechTypes}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={techTypeQuery.isLoading || saving}
          className="my-5 submit"
        >
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
