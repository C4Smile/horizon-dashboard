import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// partials
import { Loading, TextInput } from "@sito/dashboard-app";

// components
import { ImageFormType, ImageUploader } from "components";

// providers
import {
  useNotification,
  useAccount,
  queryClient,
  useHorizonApiClient,
} from "providers";

// utils
import { ReactQueryKeys } from "utils";
import { NotificationEnumType } from "lib";
import { UserFormType } from "features/users";

// api
import { isHttpRequestError } from "api";

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

/**
 * PersonalInfo
 * @returns PersonalInfo page Component
 */
function PersonalInfo() {
  const { t } = useTranslation();

  const { account } = useAccount();
  const horizonApiClient = useHorizonApiClient();

  const id = account?.horizonUser?.id;

  const [notFound, setNotFound] = useState(false);

  const { setNotification, showErrorNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setLastUpdate] = useState<string>("");

  const { handleSubmit, reset, control } = useForm<UserFormType>();

  const [photo, setPhoto] = useState<ImageFormType | null>(null);

  const onSubmit = async (d: UserFormType) => {
    if (!photo) {
      showErrorNotification({
        type: NotificationEnumType.error,
        message: t("_accessibility:messages.images"),
      });
      return;
    }

    setSaving(true);
    try {
      const result = await horizonApiClient.User.updateFromForm(d, photo);
      const { error, status } = result;

      setNotification(String(status), { model: t("_entities:entities.user") });
      setLastUpdate(new Date().toDateString());
      if (error && error !== null) console.error(error.message);
      else
        queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Users, id] });
    } catch (e: unknown) {
      console.error(e);
      setNotification(
        isHttpRequestError(e) ? String(e.status) : "notConnected",
        {
        model: t("_entities:entities.user"),
        },
      );
    }
    setSaving(false);
  };

  const userQuery = useQuery({
    queryKey: [ReactQueryKeys.Users, id],
    queryFn: () => horizonApiClient.User.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = userQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [userQuery]);

  useEffect(() => {
    if (userQuery.data) {
      if (userQuery.data?.image) setPhoto(userQuery?.data?.image);
      reset({ ...userQuery.data });
      setLastUpdate(String(userQuery?.data?.updatedAt ?? ""));
    }

    if (!id) {
      setPhoto(null);
      reset({
        id: undefined,
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [id, reset, userQuery.data]);

  return notFound ? (
    <NotFound />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2 className="text-1xl md:text-2xl font-bold">
        {t("_pages:settings.links.account")}
      </h2>
      {userQuery.isLoading ? (
        <Loading
          className="bg-none w-6 h-6 mb-10"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      ) : (
        <div className={id && updatedAt ? "" : "mt-5"}>
          {id && updatedAt && (
            <p className="text-sm mb-10">
              {t("_accessibility:labels.updatedAt")}{" "}
              {new Date(updatedAt).toLocaleDateString("es-ES")}
            </p>
          )}
        </div>
      )}
      {/* User Name */}
      <Controller
        control={control}
        disabled={userQuery.isLoading || saving}
        name="name"
        render={({ field }) => (
          <TextInput
            {...field}
            type="text"
            id="name"
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
            id="email"
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
            id="username"
            placeholder={t("_entities:user.username.placeholder")}
            label={t("_entities:user.username.label")}
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
            id="address"
            placeholder={t("_entities:user.address.placeholder")}
            label={t("_entities:user.address.label")}
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
            id="phone"
            placeholder={t("_entities:user.phone.placeholder")}
            label={t("_entities:user.phone.label")}
            required
            {...field}
          />
        )}
      />
      {/* User Image */}
      <div className="mb-5">
        {userQuery.isLoading ? (
          <Loading />
        ) : (
          <ImageUploader
            photo={photo}
            setPhoto={setPhoto}
            label={t("_entities:user.image.label")}
            folder={ReactQueryKeys.Users}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={userQuery.isLoading || saving}
        className="mb-5 submit"
      >
        {(userQuery.isLoading || saving) && (
          <Loading
            className="button-loading"
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
