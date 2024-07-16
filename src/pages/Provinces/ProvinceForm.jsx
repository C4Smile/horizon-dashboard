import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * Province Form page component
 * @returns Province Form page component
 */
function ProvinceForm() {
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
      if (!d.id) result = await museumApiClient.Province.create(d);
      else result = await museumApiClient.Province.update(d);
      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.province") });
      // eslint-disable-next-line no-console
      if (status !== 201) console.error(error);
      else if (id === undefined)
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Customers, id] });
      else reset({ id: undefined, name: "", countryId: undefined });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const provinceQuery = useQuery({
    queryKey: [ReactQueryKeys.Provinces, id],
    queryFn: () => museumApiClient.Province.getById(id),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = provinceQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [provinceQuery]);

  useEffect(() => {
    if (provinceQuery.data) reset({ ...provinceQuery.data });

    if (!id) {
      reset({
        id: undefined,
        name: "",
        countryId: undefined,
      });
    }
  }, [provinceQuery.data, id, reset]);

  const countryQuery = useQuery({
    queryKey: [ReactQueryKeys.Countries],
    queryFn: () => museumApiClient.Country.getAll(),
    retry: false,
  });

  const countryList = useMemo(() => {
    try {
      return countryQuery?.data?.map((c) => ({ value: `${c.name} - ${c.iso}`, id: c.id })) || [];
    } catch (err) {
      return [];
    }
  }, [countryQuery.data]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:provinces.editForm")} ${id}` : t("_pages:provinces.newForm")}
        </h1>
        {/* Name */}
        <Controller
          control={control}
          disabled={provinceQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:province.name.placeholder")}
              label={t("_entities:province.name.label")}
              required
            />
          )}
        />
        {/* Country Id */}
        <Controller
          control={control}
          name="countryId"
          disabled={provinceQuery.isLoading || countryQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="countryId"
              name="countryId"
              label={t("_entities:province.country.label")}
              options={countryList}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />

        <button
          type="submit"
          disabled={provinceQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(provinceQuery.isLoading || saving) && (
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

export default ProvinceForm;
