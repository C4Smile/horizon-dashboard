import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import loadable from "@loadable/component";

// editor
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

// components
import Loading from "../../../partials/loading/Loading";
import TextInput from "../../../components/Forms/TextInput";

// providers
import { useNotification } from "../../../providers/NotificationProvider";
import { queryClient, useHorizonApiClient } from "../../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() => import("../../../components/Forms/HtmlInput"));

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
  const [lastUpdate, setLastUpdate] = useState("");

  const { handleSubmit, reset, control, getValues } = useForm();

  const [photo, setPhoto] = useState();

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Cannon.create(d, photo);
      else result = await horizonApiClient.Cannon.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.cannon") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error !== null && error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Cannons] });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Cannons, id] });
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.cannon") });
    }
    setSaving(false);
  };

  useEffect(() => {
    if (cannonQuery.data) {
      //* PARSING PHOTO
      setPhoto(cannonQuery.data?.image);

      //* PARSING CONTENT
      if (cannonQuery.data?.description && typeof cannonQuery.data?.description === "string") {
        const html = cannonQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(descriptionBlock);
          cannonQuery.data.description = EditorState.createWithContent(descriptionState);
        }
      }
      setLastUpdate(cannonQuery?.data?.lastUpdate);
      reset({ ...cannonQuery.data });
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
      <h1 className="text-2xl md:text-3xl font-bold">
        {id ? `${t("_pages:cannons.editForm")} ${id}` : t("_pages:cannons.newForm")}
      </h1>

      {cannonQuery.isLoading ? (
        <Loading
          className="bg-none w-6 h-6 mb-10"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      ) : id ? (
        <>
          <div className={lastUpdate?.length ? "" : "mt-5"}>
            {lastUpdate?.length && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.lastUpdate")}{" "}
                {new Date(lastUpdate).toLocaleDateString("es-ES")}
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

      <button type="submit" disabled={cannonQuery.isLoading || saving} className="my-5 submit">
        {(cannonQuery.isLoading || saving) && (
          <Loading className="button-loading" strokeWidth="4" loaderClass="!w-6" color="stroke-white" />
        )}
        {t("_accessibility:buttons.save")}
      </button>
    </form>
  );
}

export default GeneralInfo;
