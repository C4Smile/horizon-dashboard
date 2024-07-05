import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useHotelApiClient } from "../../providers/HotelApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * Tag Form page component
 * @returns Tag Form page component
 */
function TagForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const hotelApiClient = useHotelApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      let result;
      if (!d.id) result = await hotelApiClient.Tag.create(d);
      else result = await hotelApiClient.Tag.update(d);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.tag") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (status !== 201) console.error(error);
      else if (id !== undefined) queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Tags, id] });
      else
        reset({
          id: undefined,
          name: "",
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.tag") });
    }
    setSaving(false);
  };

  const tagQuery = useQuery({
    queryKey: [ReactQueryKeys.Tags, id],
    queryFn: () => hotelApiClient.Tag.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = tagQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [tagQuery]);

  useEffect(() => {
    if (tagQuery.data) {
      setLastUpdate(tagQuery?.data?.lastUpdate);
      reset({ ...tagQuery.data });
    }

    if (!id) {
      reset({
        id: undefined,
        name: "",
      });
    }
  }, [tagQuery.data, id, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id ? `${t("_pages:tags.editForm")} ${id}` : t("_pages:tags.newForm")}
        </h1>
        {tagQuery.isLoading ? (
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
        {/* Tags Name */}
        <Controller
          control={control}
          disabled={tagQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:tag.name.placeholder")}
              label={t("_entities:tag.name.label")}
              required
            />
          )}
        />
        <button type="submit" disabled={tagQuery.isLoading || saving} className="mb-5 submit">
          {(tagQuery.isLoading || saving) && (
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

export default TagForm;
