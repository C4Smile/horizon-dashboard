import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import DatePicker from "../../components/Forms/DatePicker";
import ParagraphInput from "../../components/Forms/ParagraphInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * Event Form page component
 * @returns Event Form page component
 */
function EventForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      let result;
      if (!d.id) result = await museumApiClient.Event.create(d);
      else result = await museumApiClient.Event.update(d);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.event") });
      // eslint-disable-next-line no-console
      if (status !== 201) console.error(error);
      else if (id !== undefined)
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Events, id] });
      else
        reset({
          id: undefined,
          title: "",
          description: "",
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.event") });
    }
    setSaving(false);
  };

  const eventQuery = useQuery({
    queryKey: [ReactQueryKeys.Events, id],
    queryFn: () => museumApiClient.Event.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = eventQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [eventQuery]);

  useEffect(() => {
    if (eventQuery.data) reset({ ...eventQuery.data });

    if (!id) {
      reset({
        id: undefined,
        title: "",
        description: "",
      });
    }
  }, [eventQuery.data, id, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:events.editForm")} ${id}` : t("_pages:events.newForm")}
        </h1>
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
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:event.title.placeholder")}
              label={t("_entities:event.title.label")}
              required
            />
          )}
        />
        <div className="flex gap-5">
          <Controller
            control={control}
            disabled={eventQuery.isLoading || saving}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                id="startDate"
                name="startDate"
                placeholder={t("_entities:event.description.placeholder")}
                label={t("_entities:event.startDate.label")}
                {...field}
              >
                <div className="absolute inset-0 left-0 -top-5 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
                  </svg>
                </div>
              </DatePicker>
            )}
          />
          <Controller
            control={control}
            disabled={eventQuery.isLoading || saving}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                id="endDate"
                name="endDate"
                placeholder={t("_entities:event.description.placeholder")}
                label={t("_entities:event.startDate.label")}
                {...field}
              >
                <div className="absolute inset-0 left-0 -top-5 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
                  </svg>
                </div>
              </DatePicker>
            )}
          />
        </div>
        <Controller
          control={control}
          disabled={eventQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              inputClassName="!h-80"
              placeholder={t("_entities:event.description.placeholder")}
              label={t("_entities:event.description.label")}
            />
          )}
        />

        <button
          type="submit"
          disabled={eventQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(eventQuery.isLoading || saving) && (
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

export default EventForm;
