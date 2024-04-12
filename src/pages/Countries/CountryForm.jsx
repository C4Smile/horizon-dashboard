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
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * Country Form page component
 * @returns Country Form page component
 */
function CountryForm() {
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
      if (!d.id) result = await museumApiClient.Country.create(d);
      else result = await museumApiClient.Country.update(d);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.country") });
      // eslint-disable-next-line no-console
      if (status !== 201) console.error(error);
      else if (id !== undefined)
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Countries, id] });
      else
        reset({
          id: undefined,
          name: "",
          iso: "",
        });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.country") });
    }
    setSaving(false);
  };

  const countryQuery = useQuery({
    queryKey: [ReactQueryKeys.Countries, id],
    queryFn: () => museumApiClient.Country.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = countryQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [countryQuery]);

  useEffect(() => {
    if (countryQuery.data) reset({ ...countryQuery.data });

    if (!id) {
      reset({
        id: undefined,
        name: "",
        iso: "",
      });
    }
  }, [countryQuery.data, id, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:countries.editForm")} ${id}` : t("_pages:countries.newForm")}
        </h1>
        <Controller
          control={control}
          disabled={countryQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="name"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:country.name.placeholder")}
              label={t("_entities:country.name.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          disabled={countryQuery.isLoading || saving}
          name="iso"
          render={({ field }) => (
            <TextInput
              {...field}
              type="name"
              name="iso"
              id="iso"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:country.iso.placeholder")}
              label={t("_entities:country.iso.label")}
              required
            />
          )}
        />
        <button
          type="submit"
          disabled={countryQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(countryQuery.isLoading || saving) && (
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

export default CountryForm;
