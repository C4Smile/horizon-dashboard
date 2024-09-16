import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// editor
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import ImageUploader from "../../components/ImageUploader";
import ParagraphInput from "../../components/Forms/ParagraphInput";
import AutocompleteInput from "../../components/Forms/AutocompleteInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));
const ScheduleInput = loadable(() => import("../../components/ScheduleInput"));

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Service Form page component
 * @returns Service Form page component
 */
function ServiceForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photo, setPhoto] = useState();

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await museumApiClient.Service.create(d, photo);
      else result = await museumApiClient.Service.update(d, photo);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.service") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Services] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Services, id] });
        else {
          setPhoto({ type: "set", items: [] });
          reset({
            id: undefined,
            name: "",
            description: "",
            serviceRoom: [],
            content: null,
            newServiceHasSchedule: [],
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.service") });
    }
    setSaving(false);
  };

  const serviceQuery = useQuery({
    queryKey: [ReactQueryKeys.Services, id],
    queryFn: () => museumApiClient.Service.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = serviceQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [serviceQuery]);

  useEffect(() => {
    if (serviceQuery.data?.imageId) setPhoto(serviceQuery?.data?.imageId);

    if (!id) {
      setPhoto();
      reset({
        id: undefined,
        name: "",
        description: "",
        content: null,
        newServiceHasSchedule: [],
      });
    }
  }, [serviceQuery.data, id, reset]);

  const roomsQuery = useQuery({
    queryKey: [ReactQueryKeys.Rooms],
    queryFn: () => museumApiClient.Room.getAll(),
  });

  const roomsList = useMemo(() => {
    try {
      return roomsQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [roomsQuery.data]);

  useEffect(() => {
    if (serviceQuery.data) {
      //* PARSING PLACES
      const parsedRooms = roomsList.filter((room) =>
        serviceQuery?.data?.serviceRoom?.some((lRoom) => lRoom.roomId === room.id),
      );
      //* PARSING SCHEDULE
      serviceQuery.data.newServiceHasSchedule = serviceQuery.data?.serviceHasSchedule;
      //* PARSING CONTENT
      if (serviceQuery.data?.content && typeof serviceQuery.data?.content === "string") {
        const html = serviceQuery.data?.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          serviceQuery.data.content = editorState;
        }
      }
      setLastUpdate(serviceQuery?.data?.lastUpdate);
      reset({ ...serviceQuery.data, roomsId: parsedRooms });
    }
  }, [serviceQuery.data, reset, roomsList]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:services.editForm")} ${id}` : t("_pages:services.newForm")}
        </h1>
        {serviceQuery.isLoading ? (
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
        {/* Service Name */}
        <Controller
          control={control}
          disabled={serviceQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              inputClassName="text-input peer"
              placeholder={t("_entities:service.name.placeholder")}
              label={t("_entities:service.name.label")}
              required
            />
          )}
        />
        {/* Service Schedule */}
        <Controller
          control={control}
          disabled={serviceQuery.isLoading || saving}
          name="newServiceHasSchedule"
          render={({ field }) => (
            <ScheduleInput
              label={t("_entities:service.serviceHasSchedule.label")}
              {...field}
              onlyTime
            />
          )}
        />
        {/* Service Description */}
        <Controller
          control={control}
          disabled={serviceQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              placeholder={t("_entities:service.description.placeholder")}
              label={t("_entities:service.description.label")}
            />
          )}
        />
        {/* Service Room */}
        <Controller
          control={control}
          name="roomsId"
          disabled={serviceQuery.isLoading || roomsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <AutocompleteInput
              {...rest}
              id="roomsId"
              name="roomsId"
              label={t("_entities:service.serviceRoom.label")}
              placeholder={t("_entities:service.serviceRoom.placeholder")}
              options={roomsList}
              value={value}
              multiple
              onChange={(v) => {
                onChange(v);
              }}
            />
          )}
        />
        {/* Service Image */}
        <div>
          {serviceQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploader
              photo={photo}
              setPhoto={setPhoto}
              label={`${t("_entities:service.imageId.label")}`}
              folder={`${ReactQueryKeys.Services}`}
            />
          )}
        </div>
        {/* Service Content */}
        <Controller
          control={control}
          name="content"
          disabled={serviceQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:service.content.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <button type="submit" disabled={serviceQuery.isLoading || saving} className="my-5 submit">
          {(serviceQuery.isLoading || saving) && (
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

export default ServiceForm;
