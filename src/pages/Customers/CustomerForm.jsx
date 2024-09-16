import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * CustomerForm
 * @returns CustomerForm page Component
 */
function CustomerForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      let result;

      if (!d.id) result = await museumApiClient.Customer.create(d);
      else result = await museumApiClient.Customer.update(d);

      const { error, status } = result;
      setNotification(String(status), { model: t("_entities:entities.customer") });
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else {
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Customers] });
        if (id !== undefined)
          queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Customers, id] });
        else
          reset({
            id: undefined,
            name: "",
            email: "",
            phone: "",
            address: "",
            identification: "",
            country: undefined,
          });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.customer") });
    }
    setSaving(false);
  };

  const customerQuery = useQuery({
    queryKey: [ReactQueryKeys.Customers, id],
    queryFn: () => museumApiClient.Customer.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = customerQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [customerQuery]);

  useEffect(() => {
    if (customerQuery.data) reset({ ...customerQuery.data });

    if (!id) {
      reset({
        id: undefined,
        name: "",
        email: "",
        phone: "",
        address: "",
        identification: "",
        country: undefined,
      });
    }
  }, [customerQuery.data, id, reset]);

  const countryQuery = useQuery({
    queryKey: [ReactQueryKeys.Countries],
    queryFn: () => museumApiClient.Country.getAll(),
  });

  const countryList = useMemo(() => {
    try {
      return countryQuery?.data?.items?.map((c) => ({ value: `${c.name} - ${c.iso}`, id: c.id })) || [];
    } catch (err) {
      return [];
    }
  }, [countryQuery.data]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-5">
          {id ? `${t("_pages:customers.editForm")} ${id}` : t("_pages:customers.newForm")}
        </h1>
        <Controller
          control={control}
          disabled={customerQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              inputClassName="text-input peer"
              placeholder={t("_entities:customer.name.placeholder")}
              label={t("_entities:customer.name.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          disabled={customerQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              {...field}
              type="email"
              name="email"
              id="email"
              inputClassName="text-input peer"
              placeholder={t("_entities:customer.email.placeholder")}
              label={t("_entities:customer.email.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          disabled={customerQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="address"
              id="address"
              inputClassName="text-input peer"
              placeholder={t("_entities:customer.address.placeholder")}
              label={t("_entities:customer.address.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="identification"
          disabled={customerQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="identification"
              id="identification"
              inputClassName="text-input peer"
              placeholder={t("_entities:customer.identification.placeholder")}
              label={t("_entities:customer.identification.label")}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          disabled={customerQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              type="tel"
              name="phone"
              id="phone"
              inputClassName="text-input peer"
              placeholder={t("_entities:customer.phone.placeholder")}
              label={t("_entities:customer.phone.label")}
              required
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="countryId"
          disabled={customerQuery.isLoading || countryQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="countryId"
              name="countryId"
              label={t("_entities:customer.country.label")}
              options={countryList}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />

        <button type="submit" disabled={customerQuery.isLoading || saving} className="submit primary">
          {(customerQuery.isLoading || saving) && (
            <Loading
              className="button-loading"
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

export default CustomerForm;
