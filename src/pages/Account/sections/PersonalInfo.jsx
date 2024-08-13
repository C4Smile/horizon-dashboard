import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// config
import config from "../../../config";

// components
import Loading from "../../../partials/loading/Loading";
import SelectInput from "../../../components/Forms/SelectInput";
import TextInput from "../../../components/Forms/TextInput";

// providers
import { useNotification } from "../../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../../utils/queryKeys";
import { fromLocal } from "../../../utils/local";

/**
 * Personal Info section
 * @returns Personal Info component
 */
function PersonalInfo() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const userId = fromLocal(config.user, "object")?.user?.id ?? 0;

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const userQuery = useQuery({
    queryKey: [ReactQueryKeys.Users, userId],
    queryFn: () => museumApiClient.User.getById(userId),
    enabled: userId !== undefined,
  });

  useEffect(() => {
    const { error } = userQuery;
    // eslint-disable-next-line no-console
    if (error && error !== null) console.error(error);
  }, [userQuery]);

  useEffect(() => {
    if (userQuery.data) {
      const data = userQuery.data;
      // eslint-disable-next-line no-console
      if (data && data !== null) reset({ ...data });
    }
  }, [userQuery.data, userId, reset]);

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      const { error, status } = await museumApiClient.User.update({ ...d });
      setNotification(String(status), { model: t("_entities:entities.user") });

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  const rolesQuery = useQuery({
    queryKey: [ReactQueryKeys.UserRoles],
    queryFn: () => museumApiClient.UserRole.getAll(),
  });

  const roleList = useMemo(() => {
    try {
      return rolesQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [rolesQuery.data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form pt-10">
      <h2 className="text-1xl md:text-2xl font-bold mb-5">{t("_pages:settings.links.account")}</h2>
      {/* User Name */}
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
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.name.placeholder")}
            label={t("_entities:user.name.label")}
            required
          />
        )}
      />
      {/* User Email */}
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
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.email.placeholder")}
            label={t("_entities:user.email.label")}
            required
          />
        )}
      />
      {/* User Username */}
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
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.username.placeholder")}
            label={t("_entities:user.username.label")}
            disabled
            required
          />
        )}
      />
      {/* User Address */}
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
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.address.placeholder")}
            label={t("_entities:user.address.label")}
            required
          />
        )}
      />
      {/* User Identification */}
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
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.identification.placeholder")}
            label={t("_entities:user.identification.label")}
            required
          />
        )}
      />
      {/* User Phone */}
      <Controller
        control={control}
        name="phone"
        disabled={userQuery.isLoading || saving}
        render={({ field }) => (
          <TextInput
            type="tel"
            name="phone"
            id="phone"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.phone.placeholder")}
            label={t("_entities:user.phone.label")}
            required
            {...field}
          />
        )}
      />
      {/* User Role */}
      <Controller
        control={control}
        name="role"
        disabled={userQuery.isLoading || rolesQuery.isLoading || saving}
        render={({ field: { onChange, value, ...rest } }) => (
          <SelectInput
            {...rest}
            id="role"
            disabled
            name="role"
            label={t("_entities:user.role.label")}
            options={roleList}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}
      />

      <button type="submit" disabled={userQuery.isLoading || saving} className="mb-5 submit">
        {(userQuery.isLoading || saving) && (
          <Loading
            className="bg-primary w-full h-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-full"
            strokeWidth="4"
            loaderClass="!w-6"
            color="stroke-white"
          />
        )}
        {t("_accessibility:buttons.save")}
      </button>
    </form>
  );
}

export default PersonalInfo;
