import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// @sito/dashboard-app
import { CheckInput, Loading, TextInput } from "@sito/dashboard-app";

// components
import { FormTitle, SaveFab } from "components";

// providers
import { useNotification, queryClient, useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "utils";

// api
import { isHttpRequestError } from "api";

// lib
import { NationDto } from "../lib";
import { FormValues } from "lib";

// loadable
const HtmlInput = loadable(() =>
  import("components").then((module) => ({
    default: module.HtmlInput,
  })),
);

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

/**
 * Nation Form page component
 * @returns Nation Form page component
 */
function NationForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const { handleSubmit, reset, control } = useForm<FormValues<NationDto>>();

  const onSubmit = async (d: FormValues<NationDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Nation.createFromForm(d);
      else result = await horizonApiClient.Nation.updateFromForm(d);

      const { error, status } = result;
      setNotification(String(status), {
        model: t("_entities:entities.nation"),
      });
      setUpdatedAt(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Nations],
        });
        if (id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Nations, id],
          });
        else {
          reset({
            id: undefined,
            name: "",
            description: "",
            playable: true,
          });
        }
      }
    } catch (e: unknown) {
      console.error(e);
      setNotification(
        isHttpRequestError(e) ? String(e.status) : "notConnected",
        {
          model: t("_entities:entities.nation"),
        },
      );
    }
    setSaving(false);
  };

  const nationQuery = useQuery({
    queryKey: [ReactQueryKeys.Nations, id],
    queryFn: () => horizonApiClient.Nation.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = nationQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [nationQuery]);

  useEffect(() => {
    if (nationQuery.data) {
      setUpdatedAt(String(nationQuery?.data?.updatedAt ?? ""));
      reset({ ...nationQuery.data });
    }

    if (!id) {
      reset({
        id: undefined,
        name: "",
        description: "",
        playable: true,
      });
    }
  }, [nationQuery.data, reset, id]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormTitle>
          {id
            ? `${t("_accessibility:components.form.editing")} ${
                nationQuery.data?.name ?? id
              }`
            : t("_pages:nations.newForm")}
        </FormTitle>
        {nationQuery.isLoading ? (
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

        <div className="form-grid">
          <div className="form-column gap-5">
            {/* Nation Name */}
            <Controller
              control={control}
              disabled={nationQuery.isLoading || saving}
              name="name"
              render={({ field }) => (
                <TextInput
                  {...field}
                  type="text"
                  id="name"
                  placeholder={t("_entities:nation.name.placeholder")}
                  label={t("_entities:nation.name.label")}
                  required
                />
              )}
            />

            {/* Nation Playable */}
            <Controller
              control={control}
              name="playable"
              disabled={nationQuery.isLoading || saving}
              render={({ field: { value, onChange, ...rest } }) => (
                <CheckInput
                  {...rest}
                  id="playable"
                  label={t("_entities:nation.playable.label")}
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
          </div>

          {/* Nation description */}
          <Controller
            control={control}
            name="description"
            disabled={nationQuery.isLoading || saving}
            render={({ field: { onChange, value, ...rest } }) => (
              <HtmlInput
                label={t("_entities:nation.description.label")}
                wrapperClassName="w-full"
                {...rest}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <SaveFab
          disabled={nationQuery.isLoading || saving}
          loading={nationQuery.isLoading || saving}
        />
      </form>
    </div>
  );
}

export default NationForm;
