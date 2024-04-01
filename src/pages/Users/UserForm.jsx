import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import PasswordInput from "../../components/Forms/PasswordInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

/**
 * UserForm
 * @returns UserForm page Component
 */
function UserForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setNotification("");
    setSaving(true);
    try {
      let result;
      if (d.password !== d.rPassword) {
        setSaving(false);
        // eslint-disable-next-line no-console
        console.error(t("_accessibility:errors.passwordDoNotMatch"));
        return setNotification(t("_accessibility:errors.passwordDoNotMatch"));
      }
      if (d.id) result = await museumApiClient.User.create(d);
      else result = await museumApiClient.User.update(d);
      const { error, status } = result;
      setNotification(String(status));

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
      else if (id !== undefined)
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Users, id] });
      else reset({});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const userQuery = useQuery({
    queryKey: [ReactQueryKeys.Users, id],
    queryFn: () => museumApiClient.User.getById(id, "*", ["password", "rPassword"]),
    enabled: id !== undefined,
    retry: false,
  });

  useEffect(() => {
    const { error } = userQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [userQuery]);

  useEffect(() => {
    if (userQuery.data) {
      const { data } = userQuery.data;
      // eslint-disable-next-line no-console
      if (data && data !== null) reset({ ...data });
    }
  }, [userQuery.data, id, reset]);

  return (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5">
          {id ? `${t("_pages:users.editForm")} ${id}` : t("_pages:users.newForm")}
        </h1>
        <Controller
          control={control}
          disabled={userQuery.isLoading || saving}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.name.placeholder")}
              label={t("_entities:user.name.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          disabled={userQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              {...field}
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.email.placeholder")}
              label={t("_entities:user.email.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          disabled={userQuery.isLoading || saving}
          name="username"
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="username"
              id="username"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.username.placeholder")}
              label={t("_entities:user.username.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          disabled={userQuery.isLoading || saving}
          name="password"
          render={({ field }) => (
            <PasswordInput
              {...field}
              name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.password.placeholder")}
              label={t("_entities:user.password.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          disabled={userQuery.isLoading || saving}
          name="rPassword"
          render={({ field }) => (
            <PasswordInput
              {...field}
              name="rPassword"
              id="rPassword"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.rPassword.placeholder")}
              label={t("_entities:user.rPassword.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          disabled={userQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="address"
              id="address"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.address.placeholder")}
              label={t("_entities:user.address.label")}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="identification"
          disabled={userQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              name="identification"
              id="identification"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.identification.placeholder")}
              label={t("_entities:user.identification.label")}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          disabled={userQuery.isLoading || saving}
          render={({ field }) => (
            <TextInput
              type="tel"
              name="phone"
              id="phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder={t("_entities:user.phone.placeholder")}
              label={t("_entities:user.phone.label")}
              required
              {...field}
            />
          )}
        />

        <button
          type="submit"
          disabled={userQuery.isLoading || saving}
          className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {(userQuery.isLoading || saving) && (
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

export default UserForm;
