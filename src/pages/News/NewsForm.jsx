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
import { queryClient, useHotelApiClient } from "../../providers/HotelApiProvider";

// utils
import { localPhotoReducer } from "../../components/utils";
import { ReactQueryKeys } from "../../utils/queryKeys";

// loadable
const TextInput = loadable(() => import("../../components/Forms/TextInput"));
const HtmlInput = loadable(() => import("../../components/Forms/HtmlInput"));
const ParagraphInput = loadable(() => import("../../components/Forms/ParagraphInput"));
const AutocompleteInput = loadable(() => import("../../components/Forms/AutocompleteInput"));
const ImageKitIoUploaderMultiple = loadable(
  () => import("../../components/ImageKitIoUploaderMultiple"),
);

/**
 * News Form page component
 * @returns News Form page component
 */
function NewsForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const hotelApiClient = useHotelApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photos, setPhotos] = useReducer(localPhotoReducer, []);

  const onSubmit = async (d) => {
    setSaving(true);

    try {
      let result;
      if (!d.id) result = await hotelApiClient.News.create(d, photos);
      else result = await hotelApiClient.News.update(d, photos);

      const { message, status } = result;
      setNotification(String(status), { model: t("_entities:entities.news") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (status !== 201) console.error(message);
      else if (id !== undefined) queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.News, id] });
      else {
        setPhotos({ type: "set", items: [] });
        reset({
          id: undefined,
          title: "",
          subtitle: "",
          description: "",
          tagsId: [],
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.news") });
    }
    setSaving(false);
  };

  const newsQuery = useQuery({
    queryKey: [ReactQueryKeys.News, id],
    queryFn: () => hotelApiClient.News.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = newsQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [newsQuery]);

  useEffect(() => {
    if (newsQuery.data?.newsHasImage?.length)
      setPhotos({ type: "set", items: newsQuery.data?.newsHasImage.map((image) => image.imageId) });

    if (!id) {
      setPhotos({ type: "set", items: [] });
      reset({
        id: undefined,
        title: "",
        subtitle: "",
        description: "",
        tagsId: [],
      });
    }
  }, [newsQuery.data, id, reset]);

  const tagsQuery = useQuery({
    queryKey: [ReactQueryKeys.Tags],
    queryFn: () => hotelApiClient.Tag.getAll(),
    retry: false,
  });

  const tagsList = useMemo(() => {
    try {
      return tagsQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [tagsQuery.data]);

  useEffect(() => {
    if (newsQuery.data) {
      //* PARSING TAGS
      const parsedTags = tagsList.filter((tag) =>
        newsQuery?.data?.newsHasTag?.some((lTag) => lTag.tagId === tag.id),
      );
      //* PARSING CONTENT
      if (newsQuery.data?.content && typeof newsQuery.data?.content === "string") {
        const html = newsQuery.data?.content;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          newsQuery.data.content = editorState;
        }
      }
      setLastUpdate(newsQuery?.data?.lastUpdate);
      reset({ ...newsQuery.data, tagsId: parsedTags });
    }
  }, [tagsList, newsQuery.data, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:news.editForm")} ${id}` : t("_pages:news.newForm")}
        </h1>
        {newsQuery.isLoading ? (
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
        {/* News Title */}
        <Controller
          control={control}
          disabled={newsQuery.isLoading || saving}
          name="title"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="title"
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:news.title.placeholder")}
              label={t("_entities:news.title.label")}
              required
            />
          )}
        />
        {/* News Subtitle */}
        <Controller
          control={control}
          disabled={newsQuery.isLoading || saving}
          name="subtitle"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="subtitle"
              id="subtitle"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:news.subtitle.placeholder")}
              label={t("_entities:news.subtitle.label")}
              required
            />
          )}
        />
        {/* News Description */}
        <Controller
          control={control}
          disabled={newsQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              placeholder={t("_entities:news.description.placeholder")}
              label={t("_entities:news.description.label")}
            />
          )}
        />
        {/* News Tags */}
        <Controller
          control={control}
          name="tagsId"
          disabled={newsQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <AutocompleteInput
              {...rest}
              id="tagsId"
              name="tagsId"
              label={t("_entities:news.newsHasTag.label")}
              placeholder={t("_entities:news.newsHasTag.placeholder")}
              options={tagsList}
              value={value}
              multiple
              onChange={(v) => {
                onChange(v);
              }}
            />
          )}
        />
        {/* News Images */}
        <div>
          {newsQuery.isLoading ? (
            <Loading />
          ) : (
            <ImageKitIoUploaderMultiple
              photos={photos}
              setPhotos={setPhotos}
              label={`${t("_entities:news.newsHasImage.label")}`}
              folder={`/images/${ReactQueryKeys.News}`}
            />
          )}
        </div>
        {/* News Content */}
        <Controller
          control={control}
          name="content"
          disabled={newsQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <HtmlInput
              label={t("_entities:news.content.label")}
              wrapperClassName="mt-5 w-full"
              {...rest}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <button type="submit" disabled={newsQuery.isLoading || saving} className="my-5 submit">
          {(newsQuery.isLoading || saving) && (
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

export default NewsForm;
