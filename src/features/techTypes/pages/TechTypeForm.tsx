import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// @sito/dashboard-app
import { Loading, TextInput } from "@sito/dashboard-app";

// components
import { FormTitle, SaveFab } from "components";

// providers
import { useNotification, queryClient, useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "utils/queryKeys";

// api
import { isHttpRequestError } from "api";

// lib
import { FormValues } from "lib";
import { TechTypeDto } from "../lib";

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

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
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const { handleSubmit, reset, control } = useForm<FormValues<TechTypeDto>>();

  const onSubmit = async (d: FormValues<TechTypeDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.TechType.createFromForm(d);
      else result = await horizonApiClient.TechType.updateFromForm(d);

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
          reset({
            id: undefined,
            name: "",
          });
        }
      }
    } catch (e: unknown) {
      console.error(e);
      setNotification(
        isHttpRequestError(e) ? String(e.status) : "notConnected",
        {
          model: t("_entities:entities.techType"),
        },
      );
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
      setUpdatedAt(String(techTypeQuery?.data?.updatedAt ?? ""));
      reset({ ...techTypeQuery.data });
    }

    if (!id) {
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
        <FormTitle>
          {id
            ? `${t("_accessibility:components.form.editing")} ${id}`
            : t("_pages:techTypes.newForm")}
        </FormTitle>
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
                {t("_accessibility:labels.updatedAt")}{" "}
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
              placeholder={t("_entities:techType.name.placeholder")}
              label={t("_entities:techType.name.label")}
              required
            />
          )}
        />

        <SaveFab
          disabled={techTypeQuery.isLoading || saving}
          loading={techTypeQuery.isLoading || saving}
        />
      </form>
    </div>
  );
}

export default TechTypeForm;
