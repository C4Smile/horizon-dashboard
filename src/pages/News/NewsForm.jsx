import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";
import ParagraphInput from "../../components/Forms/ParagraphInput";
import AutocompleteInput from "../../components/Forms/AutocompleteInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * News Form page component
 * @returns News Form page component
 */
function NewsForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const [photo, setPhoto] = useState();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      let result;
      if (photo) d.photo = photo.id;
      else d.photo = 0;
      if (!d.id) result = await museumApiClient.News.create(d);
      else result = await museumApiClient.News.update(d);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.news") });
      // eslint-disable-next-line no-console
      if (status !== 201) console.error(error);
      else if (id !== undefined) queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.News, id] });
      else
        reset({
          id: undefined,
          title: "",
          description: "",
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.news") });
    }
    setSaving(false);
  };

  const newsQuery = useQuery({
    queryKey: [ReactQueryKeys.News, id],
    queryFn: () => museumApiClient.News.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = newsQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [newsQuery]);

  useEffect(() => {
    if (newsQuery.data?.photo?.url) setPhoto(newsQuery.data?.photo);

    if (!id) {
      reset({
        id: undefined,
        title: "",
        description: "",
      });
    }
  }, [newsQuery.data, id, reset]);

  const tagsQuery = useQuery({
    queryKey: [ReactQueryKeys.Tags],
    queryFn: () => museumApiClient.Tags.getAll(),
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
      reset({ ...newsQuery.data });
    }
  }, [newsQuery.data, reset]);

  const provinceQuery = useQuery({
    queryKey: [ReactQueryKeys.Provinces],
    queryFn: () => museumApiClient.Province.getAll(),
    retry: false,
  });

  const provinceList = useMemo(() => {
    try {
      return provinceQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) || [];
    } catch (err) {
      return [];
    }
  }, [provinceQuery.data]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:news.editForm")} ${id}` : t("_pages:news.newForm")}
        </h1>
        {/* Title */}
        <Controller
          control={control}
          disabled={newsQuery.isLoading || saving}
          name="title"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              title="title"
              id="title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:news.title.placeholder")}
              label={t("_entities:news.title.label")}
              required
            />
          )}
        />
        {/* Description */}
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
        {/* Tags */}
        <Controller
          control={control}
          name="tags"
          disabled={newsQuery.isLoading || tagsQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <AutocompleteInput
              {...rest}
              id="tags"
              name="tags"
              label={t("_entities:news.tags.label")}
              placeholder={t("_entities:news.tags.placeholder")}
              options={tagsList}
              value={value}
              multiple
              onChange={(v) => {
                onChange(v);
              }}
            />
          )}
        />
        {/* Province Id */}
        <Controller
          control={control}
          name="provinceId"
          disabled={newsQuery.isLoading || provinceQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="provinceId"
              name="provinceId"
              label={t("_entities:news.province.label")}
              options={provinceList}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />

        <button
          type="submit"
          disabled={newsQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(newsQuery.isLoading || saving) && (
            <Loading
              className="bg-primary w-full h-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-lg "
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          )}
          {t("_accessibility:buttons.submit")}
        </button>
      </form>
    </div>
  );
}

export default NewsForm;
