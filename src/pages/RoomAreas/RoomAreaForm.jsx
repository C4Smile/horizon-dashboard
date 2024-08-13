import { useEffect, useMemo, useState, useReducer } from "react";
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
import SelectInput from "../../components/Forms/SelectInput";
import ParagraphInput from "../../components/Forms/ParagraphInput";
import AutocompleteInput from "../../components/Forms/AutocompleteInput";
import ImageUploaderMultiple from "../../components/ImageUploaderMultiple";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { localPhotoReducer } from "../../components/utils";
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * RoomArea Form page component
 * @returns RoomArea Form page component
 */
function RoomAreaForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState();
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [images360, setImages360] = useReducer(localPhotoReducer, []);
  const [photos, setPhotos] = useReducer(localPhotoReducer, []);

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      let result;
      if (!d.id) result = await museumApiClient.RoomArea.create(d, photos, images360);
      else result = await museumApiClient.RoomArea.update(d, photos, images360);
      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.roomArea") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.RoomAreas] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.RoomAreas, id] });
        else {
          setPhotos({ type: "set", items: [] });
          setImages360({ type: "set", items: [] });
          reset({
            id: undefined,
            order: 1,
            description: "",
            content: null,
            roomId: null,
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const roomAreaQuery = useQuery({
    queryKey: [ReactQueryKeys.RoomAreas, id],
    queryFn: () => museumApiClient.RoomArea.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = roomAreaQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [roomAreaQuery]);

  const statusQuery = useQuery({
    queryKey: [ReactQueryKeys.RoomAreaStatuses],
    queryFn: () => museumApiClient.RoomStatus.getAll(),
  });

  const statusList = useMemo(() => {
    try {
      return statusQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [statusQuery.data]);

  useEffect(() => {
    if (roomAreaQuery.data) {
      if (roomAreaQuery.data?.roomAreaHasImage?.length)
        setPhotos({
          type: "set",
          items: roomAreaQuery.data?.roomAreaHasImage.map((image) => image.imageId),
        });
      if (roomAreaQuery.data?.roomAreaHasImage360?.length)
        setImages360({
          type: "set",
          items: roomAreaQuery.data?.roomAreaHasImage360.map((image) => image.imageId),
        });
      //* PARSING CONTENT
      if (roomAreaQuery.data?.content && typeof roomAreaQuery.data?.content === "string") {
        const html = roomAreaQuery.data?.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          roomAreaQuery.data.content = editorState;
        }
      }
      setLastUpdate(roomAreaQuery?.data?.lastUpdate);
      reset({
        ...roomAreaQuery.data,
        roomId: { value: roomAreaQuery.data.room?.name, id: roomAreaQuery.data.room?.id },
      });
    }

    if (!id) {
      setPhotos({ type: "set", items: [] });
      setImages360({ type: "set", items: [] });
      reset({
        id: undefined,
        order: 1,
        content: null,
        roomId: null,
      });
    }
  }, [id, reset, roomAreaQuery.data]);

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

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:roomAreas.editForm")} ${id}` : t("_pages:roomAreas.newForm")}
        </h1>
        {roomAreaQuery.isLoading ? (
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
        {/* RoomArea Status */}
        {id && (
          <Controller
            control={control}
            name="statusId"
            disabled={roomAreaQuery.isLoading || saving}
            render={({ field: { onChange, value, ...rest } }) => (
              <SelectInput
                {...rest}
                id="statusId"
                name="statusId"
                label={t("_entities:roomArea.status.label")}
                options={statusList}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
            )}
          />
        )}
        {/* RoomArea Room */}
        <Controller
          control={control}
          name="roomId"
          disabled={roomAreaQuery.isLoading || roomsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <AutocompleteInput
              {...rest}
              id="roomId"
              name="roomId"
              label={t("_entities:roomArea.roomId.label")}
              placeholder={t("_entities:roomArea.roomId.placeholder")}
              options={roomsList}
              value={value}
              onChange={(v) => {
                onChange(v);
              }}
            />
          )}
        />
        {/* RoomArea Name */}
        <Controller
          control={control}
          disabled={roomAreaQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:roomArea.name.placeholder")}
              label={t("_entities:roomArea.name.label")}
            />
          )}
        />
        {/* RoomArea Description */}
        <Controller
          control={control}
          disabled={roomAreaQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              placeholder={t("_entities:roomArea.description.placeholder")}
              label={t("_entities:roomArea.description.label")}
            />
          )}
        />
        {/* RoomArea 360 Images */}
        <div>
          {roomAreaQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploaderMultiple
              photos={images360}
              apiClient={museumApiClient.Image360}
              setPhotos={setImages360}
              label={`${t("_entities:roomArea.roomAreaHasImage360.label")}`}
              folder={`${ReactQueryKeys.RoomAreas}`}
            />
          )}
        </div>
        {/* RoomArea Images */}
        <div className="my-5">
          {roomAreaQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploaderMultiple
              photos={photos}
              setPhotos={setPhotos}
              label={`${t("_entities:roomArea.roomAreaHasImage.label")}`}
              folder={`${ReactQueryKeys.RoomAreas}`}
            />
          )}
        </div>
        {/* RoomArea content */}
        <Controller
          control={control}
          name="content"
          disabled={roomAreaQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:roomArea.content.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <button type="submit" disabled={roomAreaQuery.isLoading || saving} className="my-5 submit">
          {(roomAreaQuery.isLoading || saving) && (
            <Loading
              className="bg-primary w-full h-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-full"
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

export default RoomAreaForm;
