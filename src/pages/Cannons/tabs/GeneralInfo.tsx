import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// api
import { isHttpRequestError } from "api";
import { Controller, useForm } from "react-hook-form";
import loadable from "@loadable/component";

// utils
import { toEditorState } from "utils";

// components
import { ImageFormType } from "components";

// editor

// @sito/dashboard-app
import { Loading, TextInput } from "@sito/dashboard-app";

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

/**
 * General Info
 * @param {*} props - component props
 * @returns GeneralInfo
 */
function GeneralInfo(props) {
  const { t } = useTranslation();

  const { cannonQuery } = props;

  const horizonApiClient = useHorizonApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setLastUpdate] = useState("");

  const { handleSubmit, reset, control, getValues } = useForm();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Cannon.create(d, photo);
      else result = await horizonApiClient.Cannon.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), {
        model: t("_entities:entities.cannon"),
        },
      );
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error !== null && error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Cannons],
        });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Cannons, id],
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
        model: t("_entities:entities.cannon"),
        },
      );
    }
    setSaving(false);
  };

  useEffect(() => {
    if (cannonQuery.data) {
      //* PARSING PHOTO
      setPhoto(cannonQuery.data?.image);

      setLastUpdate(cannonQuery?.data?.updatedAt);
      // the api stores html, the input edits draft state; the query
      // cache is left alone
      reset({
        ...cannonQuery.data,
        description: toEditorState(cannonQuery.data.description),
      });
    }

    if (!cannonQuery.data?.id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        creationTime: 0,
        description: "",
      });
    }
  }, [cannonQuery.data, reset]);

  const id = getValues("id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-5 gap-5">
      {cannonQuery.isLoading ? (
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

      {/* Cannon Name */}
      <Controller
        control={control}
        disabled={cannonQuery.isLoading || saving}
        name="name"
        render={({ field }) => (
          <TextInput
            {...field}
            type="text"
            name="name"
            id="name"
            className="text-input peer"
            placeholder={t("_entities:cannon.name.placeholder")}
            label={t("_entities:cannon.name.label")}
            required
          />
        )}
      />

      {/* Cannon Weight */}
      <Controller
        control={control}
        disabled={cannonQuery.isLoading || saving}
        name="weight"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="weight"
            id="weight"
            className="text-input peer"
            placeholder={t("_entities:cannon.weight.placeholder")}
            label={t("_entities:cannon.weight.label")}
            required
          />
        )}
      />

      {/* Cannon Base Damage */}
      <Controller
        control={control}
        disabled={cannonQuery.isLoading || saving}
        name="baseDamage"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="baseDamage"
            id="baseDamage"
            className="text-input peer"
            placeholder={t("_entities:cannon.baseDamage.placeholder")}
            label={t("_entities:cannon.baseDamage.label")}
            required
          />
        )}
      />

      {/* Cannon Creation Time */}
      <Controller
        control={control}
        disabled={cannonQuery.isLoading || saving}
        name="creationTime"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="creationTime"
            id="creationTime"
            className="text-input peer"
            placeholder={t("_entities:cannon.creationTime.placeholder")}
            label={t("_entities:cannon.creationTime.label")}
            required
          />
        )}
      />

      {/* Cannon description */}
      <Controller
        control={control}
        name="description"
        disabled={cannonQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <HtmlInput
            label={t("_entities:cannon.description.label")}
            wrapperClassName="mt-5 w-full"
            {...rest}
            value={value}
            onChange={onChange}
          />
        )}
      />

      <button
        type="submit"
        disabled={cannonQuery.isLoading || saving}
        className="my-5 submit"
      >
        {(cannonQuery.isLoading || saving) && (
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
