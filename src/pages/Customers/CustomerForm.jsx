import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import SelectInput from "../../components/Forms/SelectInput";
import Notification from "../../partials/Notification";

// providers
import { useHotelApiClient } from "../../providers/HotelApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

const countries = ["United States", "Canada", "France", "Germany"];

/**
 * CustomerForm
 * @returns CustomerForm page Component
 */
function CustomerForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const hotelApiClient = useHotelApiClient();

  const [notification, setNotification] = useState("");
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setNotification("");
    setSaving(true);
    try {
      const result = await hotelApiClient.Customer.create(d);
      const { error, status } = result;
      setNotification(String(status));

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
      else reset();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const customerQuery = useQuery({
    queryKey: [ReactQueryKeys.Customers],
    queryFn: () => hotelApiClient.Customer.getById(id),
    enabled: !!id,
  });

  useEffect(() => {
    const { error } = customerQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [customerQuery]);

  useEffect(() => {
    if (customerQuery.data) {
      const { data } = customerQuery.data;
      // eslint-disable-next-line no-console
      if (data && data !== null) reset({ ...data });
    }
  }, [customerQuery, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <Notification notification={notification} />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:customers.editForm")} ${id}` : t("_pages:customers.newForm")}
        </h1>
        <Controller
          control={control}
          disabled={customerQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="name"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              type="text"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              type="text"
              name="phone"
              id="phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:customer.phone.placeholder")}
              label={t("_entities:customer.phone.label")}
              required
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          disabled={customerQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="country"
              name="country"
              label={t("_entities:customer.country.label")}
              options={countries}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />

        <button
          type="submit"
          disabled={customerQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(customerQuery.isLoading || saving) && (
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

export default CustomerForm;
