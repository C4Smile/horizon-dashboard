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
import ImageUploader from "../../../components/ImageUploader";

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

  const { shipQuery } = props;

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
      if (!d.id) result = await horizonApiClient.Ship.create(d, photo);
      else result = await horizonApiClient.Ship.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.ship") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error !== null && error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Ships] });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Ships, id] });
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
      setNotification(String(e.status), { model: t("_entities:entities.ship") });
    }
    setSaving(false);
  };

  useEffect(() => {
    if (shipQuery.data) {
      //* PARSING PHOTO
      setPhoto(shipQuery.data?.image);

      //* PARSING CONTENT
      if (shipQuery.data?.description && typeof shipQuery.data?.description === "string") {
        const html = shipQuery.data?.description;
        const descriptionBlock = htmlToDraft(html);
        if (descriptionBlock) {
          const descriptionState = ContentState.createFromBlockArray(descriptionBlock);
          shipQuery.data.description = EditorState.createWithContent(descriptionState);
        }
      }
      setLastUpdate(shipQuery?.data?.lastUpdate);
      reset({ ...shipQuery.data });
    }

    if (!shipQuery.data?.id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        creationTime: 0,
        description: "",
      });
    }
  }, [shipQuery.data, reset]);

  const id = getValues("id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-5 gap-5">
      <h1 className="text-2xl md:text-3xl font-bold">
        {id ? `${t("_pages:ships.editForm")} ${id}` : t("_pages:ships.newForm")}
      </h1>

      {shipQuery.isLoading ? (
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

      {/* Ship Name */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="name"
        render={({ field }) => (
          <TextInput
            {...field}
            type="text"
            name="name"
            id="name"
            className="text-input peer"
            placeholder={t("_entities:ship.name.placeholder")}
            label={t("_entities:ship.name.label")}
            required
          />
        )}
      />

      {/* Ship Capacity */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="capacity"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="capacity"
            id="capacity"
            className="text-input peer"
            placeholder={t("_entities:ship.capacity.placeholder")}
            label={t("_entities:ship.capacity.label")}
            required
          />
        )}
      />

      {/* Ship Base Speed */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="baseSpeed"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="baseSpeed"
            id="baseSpeed"
            className="text-input peer"
            placeholder={t("_entities:ship.baseSpeed.placeholder")}
            label={t("_entities:ship.baseSpeed.label")}
            required
          />
        )}
      />

      {/* Ship Crew */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="crew"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="crew"
            id="crew"
            className="text-input peer"
            placeholder={t("_entities:ship.crew.placeholder")}
            label={t("_entities:ship.crew.label")}
            required
          />
        )}
      />

      {/* Ship Creation Time */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="creationTime"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="creationTime"
            id="creationTime"
            className="text-input peer"
            placeholder={t("_entities:ship.creationTime.placeholder")}
            label={t("_entities:ship.creationTime.label")}
            required
          />
        )}
      />

      {/* Ship Image */}
      <div className="my-5">
        {shipQuery.isLoading ? (
          <Loading />
        ) : (
          <ImageUploader
            photo={photo}
            setPhoto={setPhoto}
            label={`${t("_entities:ship.image.label")}`}
            folder={`${ReactQueryKeys.Ships}`}
          />
        )}
      </div>

      {/* Ship description */}
      <Controller
        control={control}
        name="description"
        disabled={shipQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <HtmlInput
            label={t("_entities:ship.description.label")}
            wrapperClassName="mt-5 w-full"
            {...rest}
            value={value}
            onChange={onChange}
          />
        )}
      />

      <button type="submit" disabled={shipQuery.isLoading || saving} className="my-5 submit">
        {(shipQuery.isLoading || saving) && (
          <Loading className="button-loading" strokeWidth="4" loaderClass="!w-6" color="stroke-white" />
        )}
        {t("_accessibility:buttons.save")}
      </button>
    </form>
  );
}

export default GeneralInfo;
