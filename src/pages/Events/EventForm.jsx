import { useEffect, useMemo, useReducer, useState } from "react";
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

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { localPhotoReducer } from "../../components/utils";
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const TextInput = loadable(() => import("../../components/Forms/TextInput"));
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));
const ScheduleInput = loadable(() => import("../../components/ScheduleInput"));
const ParagraphInput = loadable(() => import("../../components/Forms/ParagraphInput"));
const AutocompleteInput = loadable(() => import("../../components/Forms/AutocompleteInput"));
const ExternalLinkInput = loadable(() => import("../../components/ExternalLinkInput"));
const ImageUploaderMultiple = loadable(() => import("../../components/ImageUploaderMultiple"));

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Event Form page component
 * @returns Event Form page component
 */
function EventForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photos, setPhotos] = useReducer(localPhotoReducer, []);

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await museumApiClient.Events.create(d, photos);
      else result = await museumApiClient.Events.update(d, photos);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.event") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Events] });
        if (id !== undefined) queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Events, id] });
        else {
          setPhotos({ type: "set", items: [] });
          reset({
            id: undefined,
            title: "",
            subtitle: "",
            address: "",
            location: "",
            content: null,
            description: "",
            tagsId: [],
            newEventHasLink: [],
            newEventHasSchedule: [],
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.event") });
    }
    setSaving(false);
  };

  const eventQuery = useQuery({
    queryKey: [ReactQueryKeys.Events, id],
    queryFn: () => museumApiClient.Events.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = eventQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [eventQuery]);

  useEffect(() => {
    if (eventQuery.data?.eventHasImage?.length)
      setPhotos({ type: "set", items: eventQuery.data?.eventHasImage.map((image) => image.imageId) });

    if (!id) {
      setPhotos({ type: "set", items: [] });
      reset({
        id: undefined,
        title: "",
        subtitle: "",
        address: "",
        location: "",
        content: null,
        description: "",
        tagsId: [],
        newEventHasLink: [],
        newEventHasSchedule: [],
      });
    }
  }, [eventQuery.data, id, reset]);

  const tagsQuery = useQuery({
    queryKey: [ReactQueryKeys.Tags],
    queryFn: () => museumApiClient.Tag.getAll(),
  });

  const tagsList = useMemo(() => {
    try {
      return tagsQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [tagsQuery.data]);

  useEffect(() => {
    if (eventQuery.data) {
      //* PARSING LINKS
      const parsedLinks = eventQuery.data?.eventHasLink?.map((link) => ({
        url: link.url,
        linkId: link.linkId.id,
      }));
      eventQuery.data.newEventHasLink = parsedLinks;
      //* PARSING SCHEDULE
      eventQuery.data.newEventHasSchedule = eventQuery.data?.eventHasSchedule;
      //* PARSING TAGS
      const parsedTags = tagsList.filter((tag) =>
        eventQuery?.data?.eventHasTag?.some((lTag) => lTag.id === tag.id),
      );
      if (eventQuery.data?.content && typeof eventQuery.data?.content === "string") {
        const html = eventQuery.data?.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          eventQuery.data.content = editorState;
        }
      }
      setLastUpdate(eventQuery?.data?.lastUpdate);
      reset({ ...eventQuery.data, tagsId: parsedTags });
    }
  }, [tagsList, eventQuery.data, reset]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:events.editForm")} ${id}` : t("_pages:events.newForm")}
        </h1>
        {eventQuery.isLoading ? (
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
        {/* Event Title */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="title"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="title"
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:event.title.placeholder")}
              label={t("_entities:event.title.label")}
              required
            />
          )}
        />
        {/* Event Subtitle */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="subtitle"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="subtitle"
              id="subtitle"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:event.subtitle.placeholder")}
              label={t("_entities:event.subtitle.label")}
              required
            />
          )}
        />
        {/* Event Address */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="address"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="address"
              id="address"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:event.address.placeholder")}
              label={t("_entities:event.address.label")}
              required
            />
          )}
        />
        {/* Event Schedule */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="newEventHasSchedule"
          render={({ field }) => (
            <ScheduleInput label={t("_entities:event.eventHasSchedule.label")} {...field} />
          )}
        />
        {/* Event Location */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="location"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="location"
              id="location"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:event.location.placeholder")}
              label={t("_entities:event.location.label")}
              required
            />
          )}
        />
        {/* Event Social Media */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="newEventHasLink"
          render={({ field }) => (
            <ExternalLinkInput
              label={t("_entities:event.eventHasLink.label")}
              placeholder={t("_entities:event.eventHasLink.placeholder")}
              {...field}
            />
          )}
        />
        {/* Event Description */}
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              placeholder={t("_entities:event.description.placeholder")}
              label={t("_entities:event.description.label")}
            />
          )}
        />
        {/* Event Tags */}
        <Controller
          control={control}
          name="tagsId"
          disabled={eventQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <AutocompleteInput
              {...rest}
              id="tagsId"
              name="tagsId"
              label={t("_entities:event.eventHasTag.label")}
              placeholder={t("_entities:event.eventHasTag.placeholder")}
              options={tagsList}
              value={value}
              multiple
              onChange={(v) => {
                onChange(v);
              }}
            />
          )}
        />
        {/* Event Images */}
        <div className="my-5">
          {eventQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploaderMultiple
              photos={photos}
              setPhotos={setPhotos}
              label={`${t("_entities:event.eventHasImage.label")}`}
              folder={`/images/${ReactQueryKeys.Events}`}
            />
          )}
        </div>
        {/* Event Content */}
        <Controller
          control={control}
          name="content"
          disabled={eventQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:event.content.label")}
              wrapperClassName="w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <button type="submit" disabled={eventQuery.isLoading || saving} className="my-5 submit">
          {(eventQuery.isLoading || saving) && (
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

export default EventForm;
