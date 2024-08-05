import { useEffect, useState, useReducer } from "react";
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
import ImageUploaderMultiple from "../../components/ImageUploaderMultiple";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { localPhotoReducer } from "../../components/utils";
import { ReactQueryKeys } from "../../utils/queryKeys";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * GuestBook Form page component
 * @returns GuestBook Form page component
 */
function GuestBookForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState();
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photos, setPhotos] = useReducer(localPhotoReducer, []);

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      let result;
      if (!d.id) result = await museumApiClient.GuestBook.create(d, photos);
      else result = await museumApiClient.GuestBook.update(d, photos);
      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.guestBook") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.GuestBooks] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.GuestBooks, id] });
        else {
          setPhotos({ type: "set", items: [] });
          reset({
            id: undefined,
            description: "",
            content: null,
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

  const guestBookQuery = useQuery({
    queryKey: [ReactQueryKeys.GuestBooks, id],
    queryFn: () => museumApiClient.GuestBook.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = guestBookQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [guestBookQuery]);

  useEffect(() => {
    if (guestBookQuery.data) {
      if (guestBookQuery.data?.guestBookHasImage?.length)
        setPhotos({
          type: "set",
          items: guestBookQuery.data?.guestBookHasImage.map((image) => image.imageId),
        });
      //* PARSING CONTENT
      if (guestBookQuery.data?.content && typeof guestBookQuery.data?.content === "string") {
        const html = guestBookQuery.data?.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          guestBookQuery.data.content = editorState;
        }
      }
      setLastUpdate(guestBookQuery?.data?.lastUpdate);
      reset({
        ...guestBookQuery.data,
        roomId: { value: guestBookQuery.data.room?.name, id: guestBookQuery.data.room?.id },
      });
    }

    if (!id) {
      setPhotos({ type: "set", items: [] });
      reset({
        id: undefined,
        description: "",
        content: null,
      });
    }
  }, [id, reset, guestBookQuery.data]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:guestBooks.editForm")} ${id}` : t("_pages:guestBooks.newForm")}
        </h1>
        {guestBookQuery.isLoading ? (
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
        {/* GuestBook Name */}
        <Controller
          control={control}
          disabled={guestBookQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:guestBook.name.placeholder")}
              label={t("_entities:guestBook.name.label")}
            />
          )}
        />
        {/* PushNotification Sent Date */}
        <Controller
          control={control}
          disabled={guestBookQuery.isLoading || saving}
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
        {/* GuestBook Images */}
        <div>
          {guestBookQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageUploaderMultiple
              photos={photos}
              setPhotos={setPhotos}
              label={`${t("_entities:guestBook.guestBookHasImage.label")}`}
              folder={`${ReactQueryKeys.GuestBooks}`}
            />
          )}
        </div>
        <button type="submit" disabled={guestBookQuery.isLoading || saving} className="my-5 submit">
          {(guestBookQuery.isLoading || saving) && (
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

export default GuestBookForm;
