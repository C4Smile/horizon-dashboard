import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";
import ParagraphInput from "../../components/Forms/ParagraphInput";
import ImageUploader from "../../components/ImageUploader";
import AutocompleteInput from "../../components/Forms/AutocompleteInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { entities, ReactQueryKeys } from "../../utils/queryKeys";
import { ActionTypes } from "./types";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * PushNotification Form page component
 * @returns PushNotification Form page component
 */
function PushNotificationForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photo, setPhoto] = useState();

  // link of type entity
  const [actionType, setActionType] = useState();
  const [previousLink, setPreviousLink] = useState();
  const [entityLinkType, setEntityLinkType] = useState();
  const [entityLinkId, setEntityLinkId] = useState();

  const entitiesQuery = useQuery({
    queryKey: [entityLinkType, previousLink ?? ""],
    queryFn: () => museumApiClient.getEntity(entityLinkType),
    enabled: !!entityLinkType,
  });

  const entityList = useMemo(() => {
    try {
      return (
        entitiesQuery?.data?.map((c) => ({
          value: `${c.name ?? c.title ?? `${t(`_entities:entities.room`)} ${c.number}`}`,
          id: c.id,
        })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [entitiesQuery?.data, t]);

  useEffect(() => {
    if (previousLink && entityList.length === 1) {
      setEntityLinkId(entityList.find((el) => el.id === Number(previousLink)));
    } else setEntityLinkId();
  }, [entityLinkType, entityList, previousLink]);

  const onSubmit = async (d) => {
    if (actionType === ActionTypes.Entity && entityLinkType && entityLinkId)
      d.action = `${entityLinkType},${entityLinkId?.id}`;

    setSaving(true);
    try {
      let result;
      if (!d.id) result = await museumApiClient.PushNotification.create(d, photo);
      else result = await museumApiClient.PushNotification.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.pushNotification") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.PushNotifications] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.PushNotifications, id] });
        else {
          setPhoto();
          reset({
            id: undefined,
            title: "",
            description: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.pushNotification") });
    }
    setSaving(false);
  };

  const pushNotificationQuery = useQuery({
    queryKey: [ReactQueryKeys.PushNotifications, id],
    queryFn: () => museumApiClient.PushNotification.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = pushNotificationQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [pushNotificationQuery]);

  useEffect(() => {
    if (pushNotificationQuery.data) {
      const pushNotification = pushNotificationQuery.data;
      if (pushNotification?.imageId) setPhoto(pushNotification?.imageId);
      //* PARSING DATE
      if (pushNotification.sentDate)
        pushNotification.sentDate = `${new Date(pushNotification.sentDate).toISOString().slice(0, 16)}`;
      if (pushNotification?.entity && pushNotification?.entity?.length) {
        //* PARSING ENTITY
        const [entityType, entityId] = pushNotification.entity.split(",");
        if (entityType) setEntityLinkType(entityType);
        if (entityId) setPreviousLink(entityId);
      }
      setLastUpdate(pushNotification?.lastUpdate);
      reset({ ...pushNotification });
    }

    if (!id) {
      setPhoto();
      reset({
        id: undefined,
        title: "",
        description: "",
      });
    }
  }, [pushNotificationQuery.data, id, reset]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id
            ? `${t("_pages:pushNotifications.editForm")} ${id}`
            : t("_pages:pushNotifications.newForm")}
        </h1>
        {pushNotificationQuery.isLoading ? (
          <Loading
            className="bg-none w-6 h-6 mb-10"
            strokeWidth="4"
            loaderClass="!w-6"
            color="stroke-primary"
          />
        ) : (
          <div className={id && lastUpdate ? "" : "mt-5"}>
            {id && lastUpdate && (
              <p className="text-sm mb-10">
                {t("_accessibility:labels.lastUpdate")}{" "}
                {new Date(lastUpdate).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        )}
        {/* PushNotification Title */}
        <Controller
          control={control}
          disabled={pushNotificationQuery.isLoading || saving}
          name="title"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="title"
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:pushNotification.title.placeholder")}
              label={t("_entities:pushNotification.title.label")}
              required
            />
          )}
        />
        {/* PushNotification Sent Date */}
        <Controller
          control={control}
          disabled={pushNotificationQuery.isLoading || saving}
          name="sentDate"
          render={({ field }) => (
            <TextInput
              {...field}
              type="datetime-local"
              name="sentDate"
              id="sentDate"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              label={t("_entities:pushNotification.sentDate.label")}
              required
            />
          )}
        />
        {/* PushNotification Description */}
        <Controller
          control={control}
          disabled={pushNotificationQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              placeholder={t("_entities:pushNotification.description.placeholder")}
              label={t("_entities:pushNotification.description.label")}
            />
          )}
        />
        <SelectInput
          id="actionType"
          name="actionType"
          label={t("_entities:room.status.label")}
          options={Object.keys(ActionTypes).map((key) => ({
            id: ActionTypes[key],
            value: t(`_entities:pushNotification.actionType.${key.toLowerCase()}`),
          }))}
          value={actionType}
          onChange={(e) => {
            setActionType(Number(e.target.value));
          }}
        />
        {/* PushNotification Link */}
        {actionType === ActionTypes.Entity && (
          <div className="w-full relative mb-5">
            <p
              className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
            >
              {t("_entities:pushNotification.entity.label")}
            </p>
            <div className="flex w-full gap-5">
              <SelectInput
                options={entities.map((entity) => ({
                  id: entity,
                  value: t(`_entities:entities.${entity}`),
                }))}
                value={entityLinkType}
                onChange={(e) => setEntityLinkType(e.target.value)}
                placeholder={t("_entities:pushNotification.entity.typePlaceholder")}
              />
              <AutocompleteInput
                value={entityLinkId}
                options={entityList}
                onChange={(v) => setEntityLinkId(v)}
                placeholder={t("_entities:pushNotification.entity.idPlaceholder", {
                  entity: t(`_entities:entities.${entityLinkType}`),
                })}
              />
            </div>
          </div>
        )}
        {actionType === ActionTypes.Link && (
          <Controller
            control={control}
            disabled={pushNotificationQuery.isLoading || saving}
            name="action"
            render={({ field }) => (
              <TextInput
                {...field}
                type="url"
                name="action"
                id="action"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder={t("_entities:pushNotification.action.placeholder")}
                label={t("_entities:pushNotification.action.label")}
                required
              />
            )}
          />
        )}
        {/* PushNotification Image */}
        <div className="mb-4">
          {pushNotificationQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={`${t("_entities:pushNotification.imageId.label")}`}
              folder={`${ReactQueryKeys.Offers}`}
            />
          )}
        </div>
        <button
          type="submit"
          disabled={pushNotificationQuery.isLoading || saving}
          className="mb-5 submit"
        >
          {(pushNotificationQuery.isLoading || saving) && (
            <Loading
              className="bg-primary w-full h-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-lg "
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

export default PushNotificationForm;
