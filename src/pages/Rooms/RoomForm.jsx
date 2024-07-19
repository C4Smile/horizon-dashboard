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
import ImageKitIoUploaderMultiple from "../../components/ImageKitIoUploaderMultiple";
import ImageKitIoUploader from "../../components/ImageKitIoUploader";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { localPhotoReducer } from "../../components/utils";
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));

/**
 * Room Form page component
 * @returns Room Form page component
 */
function RoomForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

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
      if (!d.id) result = await museumApiClient.Room.create(d, photos, images360);
      else result = await museumApiClient.Room.update(d, photos, images360);
      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.room") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
      if (id !== undefined) queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Rooms, id] });
      else {
        setPhotos({ type: "set", items: [] });
        setImages360({ type: "set", items: [] });
        reset({
          id: undefined,
          number: "",
          content: null,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const roomQuery = useQuery({
    queryKey: [ReactQueryKeys.Rooms, id],
    queryFn: () => museumApiClient.Room.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = roomQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [roomQuery]);

  const typesQuery = useQuery({
    queryKey: [ReactQueryKeys.RoomTypes],
    queryFn: () => museumApiClient.RoomType.getAll(),
    retry: false,
  });

  const typesList = useMemo(() => {
    try {
      return typesQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [typesQuery.data]);

  const statusQuery = useQuery({
    queryKey: [ReactQueryKeys.RoomStatuses],
    queryFn: () => museumApiClient.RoomStatus.getAll(),
    retry: false,
  });

  const statusList = useMemo(() => {
    try {
      return statusQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [statusQuery.data]);

  useEffect(() => {
    if (roomQuery.data) {
      if (roomQuery.data?.roomHasImage?.length)
        setPhotos({ type: "set", items: roomQuery.data?.roomHasImage.map((image) => image.imageId) });
      if (roomQuery.data?.image360Id) setImage360(roomQuery.data?.image360Id);
      //* PARSING CONTENT
      if (roomQuery.data?.content && typeof roomQuery.data?.content === "string") {
        const html = roomQuery.data?.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          roomQuery.data.content = editorState;
        }
      }
      setLastUpdate(roomQuery?.data?.lastUpdate);
      reset({ ...roomQuery.data });
    }

    if (!id) {
      setPhotos({ type: "set", items: [] });
      reset({
        id: undefined,
        number: "",
        content: null,
      });
    }
  }, [id, reset, roomQuery.data]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:rooms.editForm")} ${id}` : t("_pages:rooms.newForm")}
        </h1>
        {roomQuery.isLoading ? (
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
        {/* Room Status */}
        {id && (
          <Controller
            control={control}
            name="status"
            disabled={roomQuery.isLoading || saving}
            render={({ field: { onChange, value, ...rest } }) => (
              <SelectInput
                {...rest}
                id="status"
                name="status"
                label={t("_entities:room.status.label")}
                options={statusList}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
            )}
          />
        )}
        {/* Room Number */}
        <Controller
          control={control}
          disabled={roomQuery.isLoading || saving}
          name="number"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="number"
              id="number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:room.number.placeholder")}
              label={t("_entities:room.number.label")}
            />
          )}
        />
        {/* Room Type */}
        <Controller
          control={control}
          name="type"
          disabled={roomQuery.isLoading || typesQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="type"
              name="type"
              label={t("_entities:room.type.label")}
              options={typesList}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />
        {/* Room 360 Images */}
        <div>
          {roomQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageKitIoUploaderMultiple
              photos={images360}
              setPhotos={setImages360}
              label={`${t("_entities:room.roomHasImage360.label")}`}
              folder={`/images/${ReactQueryKeys.Rooms}`}
            />
          )}
        </div>
        {/* Room Images */}
        <div>
          {roomQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageKitIoUploaderMultiple
              photos={photos}
              setPhotos={setPhotos}
              label={`${t("_entities:room.roomHasImage.label")}`}
              folder={`/images/${ReactQueryKeys.Rooms}`}
            />
          )}
        </div>
        {/* Room content */}
        <Controller
          control={control}
          name="content"
          disabled={roomQuery.isLoading || typesQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:room.content.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <button type="submit" disabled={roomQuery.isLoading || saving} className="my-5 submit">
          {(roomQuery.isLoading || saving) && (
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

export default RoomForm;
