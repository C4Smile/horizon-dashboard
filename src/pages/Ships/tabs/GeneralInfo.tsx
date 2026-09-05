import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// lib
import { FormValues, ShipDto } from "lib";
import type { UseQueryResult } from "@tanstack/react-query";

// api
import { isHttpRequestError } from "api";
import { Controller, useForm } from "react-hook-form";
import loadable from "@loadable/component";

// utils
import { toEditorState } from "utils";

// editor

// @sito/dashboard-app
import { Loading, TextInput } from "@sito/dashboard-app";

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
  shipQuery: UseQueryResult<ShipDto>;
};

/**
 * General Info
 * @param {*} props - component props
 * @returns {JSX.Element} GeneralInfo
 */
function GeneralInfo(props: GeneralInfoPropsType) {
  const { t } = useTranslation();

  const { shipQuery } = props;

  const horizonApiClient = useHorizonApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setLastUpdate] = useState<string | Date | undefined>();

  const { handleSubmit, reset, control, getValues } = useForm<FormValues<ShipDto>>();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const onSubmit = async (d: FormValues<ShipDto>) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await horizonApiClient.Ship.createFromForm(d, photo);
      else result = await horizonApiClient.Ship.updateFromForm(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.ship") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error !== null && error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Ships],
        });
        if (d.id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Ships, id],
          });
        else {
          setPhoto(null);
          reset({
            id: undefined,
            name: "",
            capacity: 0,
            baseSpeed: 0,
            crew: 0,
            guns: 0,
            hull: 0,
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
        model: t("_entities:entities.ship"),
        },
      );
    }
    setSaving(false);
  };

  useEffect(() => {
    if (shipQuery.data) {
      //* PARSING PHOTO
      setPhoto(shipQuery.data?.image);

      setLastUpdate(shipQuery?.data?.updatedAt);
      // the api stores html, the input edits draft state; the query
      // cache is left alone
      reset({
        ...shipQuery.data,
        description: toEditorState(shipQuery.data.description),
      });
    }

    if (!shipQuery.data?.id) {
      setPhoto(null);
      reset({
        id: undefined,
        name: "",
        capacity: 0,
        baseSpeed: 0,
        crew: 0,
        guns: 0,
        hull: 0,
        creationTime: 0,
        description: "",
      });
    }
  }, [shipQuery.data, reset]);

  const id = getValues("id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form mt-5 gap-5">
      {shipQuery.isLoading ? (
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

      <div className="flex gap-2 w-full">
        {/* Ship Max knots */}
        <Controller
          control={control}
          disabled={shipQuery.isLoading || saving}
          name="knots"
          render={({ field }) => (
            <TextInput
              {...field}
              type="number"
              name="knots"
              id="knots"
              className="text-input peer"
              placeholder={t("_entities:ship.knots.placeholder")}
              label={t("_entities:ship.knots.label")}
              required
            />
          )}
        />
      </div>

      <div className="flex gap-2 w-full">
        {/* Ship Min Crew */}
        <Controller
          control={control}
          disabled={shipQuery.isLoading || saving}
          name="minCrew"
          render={({ field }) => (
            <TextInput
              {...field}
              type="number"
              name="minCrew"
              id="minCrew"
              className="text-input peer w-full"
              placeholder={t("_entities:ship.minCrew.placeholder")}
              label={t("_entities:ship.minCrew.label")}
              required
            />
          )}
        />
        {/* Ship Best Crew */}
        <Controller
          control={control}
          disabled={shipQuery.isLoading || saving}
          name="bestCrew"
          render={({ field }) => (
            <TextInput
              {...field}
              type="number"
              name="bestCrew"
              id="bestCrew"
              className="text-input peer w-full"
              placeholder={t("_entities:ship.bestCrew.placeholder")}
              label={t("_entities:ship.bestCrew.label")}
              required
            />
          )}
        />
        {/* Ship Max Crew */}
        <Controller
          control={control}
          disabled={shipQuery.isLoading || saving}
          name="maxCrew"
          render={({ field }) => (
            <TextInput
              {...field}
              type="number"
              name="maxCrew"
              id="maxCrew"
              className="text-input peer w-full"
              placeholder={t("_entities:ship.maxCrew.placeholder")}
              label={t("_entities:ship.maxCrew.label")}
              required
            />
          )}
        />
      </div>

      {/* Ship Guns */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="guns"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="guns"
            id="guns"
            className="text-input peer"
            placeholder={t("_entities:ship.guns.placeholder")}
            label={t("_entities:ship.guns.label")}
            required
          />
        )}
      />

      {/* Ship Hull */}
      <Controller
        control={control}
        disabled={shipQuery.isLoading || saving}
        name="hull"
        render={({ field }) => (
          <TextInput
            {...field}
            type="number"
            name="hull"
            id="hull"
            className="text-input peer"
            placeholder={t("_entities:ship.hull.placeholder")}
            label={t("_entities:ship.hull.label")}
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
            label={t("_entities:ship.image.label")}
            folder={ReactQueryKeys.Ships}
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

      <button
        type="submit"
        disabled={shipQuery.isLoading || saving}
        className="my-5 submit"
      >
        {(shipQuery.isLoading || saving) && (
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
