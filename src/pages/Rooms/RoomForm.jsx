import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// models
import { RoomStatus } from "../../models/Room";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";
import ParagraphInput from "../../components/Forms/ParagraphInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";
import { getEnumIdValueTuple } from "../../utils/parser";

const statuses = getEnumIdValueTuple(RoomStatus);

/**
 * Room Form page component
 * @returns Room Form page component
 */
function RoomForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm({ status: statuses[0].id });

  const onSubmit = async (d) => {
    setNotification("");
    setSaving(true);
    try {
      let result;
      if (d.id) result = await museumApiClient.Room.create(d);
      else result = await museumApiClient.Room.update(d);
      const { error, status } = result;
      setNotification(String(status));

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
      else if (id !== undefined)
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Rooms, id] });
      else reset({});
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

  useEffect(() => {
    if (roomQuery.data) {
      const { data } = roomQuery.data;
      // eslint-disable-next-line no-console
      if (data && data !== null) reset({ ...data });
    }
  }, [roomQuery.data, id, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:rooms.editForm")} ${id}` : t("_pages:rooms.newForm")}
        </h1>
        {id && (
          <Controller
            control={control}
            name="status"
            disabled={roomQuery.isLoading || saving}
            render={({ field: { onChange, value, ...rest } }) => (
              <SelectInput
                {...rest}
                id="country"
                name="country"
                label={t("_entities:room.status.label")}
                options={statuses}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
            )}
          />
        )}
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
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:room.number.placeholder")}
              label={t("_entities:room.number.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          disabled={roomQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="name"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:room.name.placeholder")}
              label={t("_entities:room.name.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          disabled={roomQuery.isLoading || saving}
          name="description"
          render={({ field }) => (
            <ParagraphInput
              {...field}
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer h-48"
              inputClassName="!h-80"
              placeholder={t("_entities:room.description.placeholder")}
              label={t("_entities:room.description.label")}
              required
            />
          )}
        />

        <button
          type="submit"
          disabled={roomQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(roomQuery.isLoading || saving) && (
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

export default RoomForm;
