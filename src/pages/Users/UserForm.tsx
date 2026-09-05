import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// @sito/dashboard-app
import { Loading, TextInput, SelectInput } from "@sito/dashboard-app";

// components
import { ImageUploader, PasswordInput } from "components";

// providers
import {
  useNotification,
  queryClient,
  useHorizonApiClient,
  NotificationSeverity,
} from "providers";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// api
import { isHttpRequestError, parseId } from "api";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * UserForm
 * @returns UserForm page Component
 */
function UserForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [updatedAt, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photo, setPhoto] = useState();

  const onSubmit = async (d) => {
    if (!photo) {
      setNotification("images", {}, NotificationSeverity.bad);
      return;
    }

    setSaving(true);
    try {
      let result;

      if (d.password !== d.rPassword) {
        setSaving(false);
        console.error(t("_accessibility:errors.passwordDoNotMatch"));
        return setNotification(t("_accessibility:errors.passwordDoNotMatch"));
      }
      // create and update both answer { data, status, error }, insert throws
      if (!d.id) result = await horizonApiClient.User.create(d, photo);
      else result = await horizonApiClient.User.update(d, photo);
      const { error, status } = result;

      setNotification(String(status), { model: t("_entities:entities.user") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      else {
        await queryClient.invalidateQueries({
          queryKey: [ReactQueryKeys.Users],
        });
        if (id !== undefined)
          await queryClient.invalidateQueries({
            queryKey: [ReactQueryKeys.Users, id],
          });
        else {
          setPhoto();
          reset({
            id: undefined,
            username: "",
            password: "",
            name: "",
            email: "",
            phone: "",
          });
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), {
        model: t("_entities:entities.user"),
      });
    }
    setSaving(false);
  };

  const userQuery = useQuery({
    queryKey: [ReactQueryKeys.Users, id],
    queryFn: () => horizonApiClient.User.getById(id),
    enabled: id !== undefined,
  });

  const roleQuery = useQuery({
    queryKey: [ReactQueryKeys.Roles],
    queryFn: () => horizonApiClient.Role.getAll(),
  });

  const roleList = useMemo(() => {
    try {
      return (
        roleQuery?.data?.items?.map((c) => ({
          value: c.name,
          id: c.id,
        })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [roleQuery.data]);

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
      // getById answers roleId as a number, the list answers it as the role
      // object, so both shapes have to resolve to the same id
      const currentRoleId = parseId(userQuery.data?.roleId);
      const roleId = roleList.find((role) => role.id === currentRoleId);
      reset({ ...userQuery.data, roleId: roleId?.id });
      setLastUpdate(userQuery?.data?.updatedAt);
    }

    if (!id) {
      setPhoto();
      reset({
        id: undefined,
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [id, reset, roleList, userQuery.data]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="px-5 pt-10 flex items-start justify-start">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h1 className="text-2xl md:text-3xl font-bold">
          {id
            ? `${t("_accessibility:components.form.editing")} ${id}`
            : t("_pages:users.newForm")}
        </h1>
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
        {/* User Role */}
        <Controller
          control={control}
          name="roleId"
          disabled={userQuery.isLoading || saving}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectInput
              {...rest}
              id="roleId"
              name="roleId"
              label={t("_entities:user.roleId.label")}
              options={roleList}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />
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
              inputClassName="text-input peer"
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
              inputClassName="text-input peer"
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
              inputClassName="text-input peer"
              placeholder={t("_entities:user.username.placeholder")}
              label={t("_entities:user.username.label")}
              required
            />
          )}
        />
        {/* User Password */}
        <Controller
          control={control}
          disabled={userQuery.isLoading || saving}
          name="password"
          render={({ field }) => (
            <PasswordInput
              {...field}
              name="password"
              id="password"
              inputClassName="text-input peer"
              placeholder={t("_entities:user.password.placeholder")}
              label={t("_entities:user.password.label")}
              required
            />
          )}
        />
        {/* User RPassword */}
        <Controller
          control={control}
          disabled={userQuery.isLoading || saving}
          name="rPassword"
          render={({ field }) => (
            <PasswordInput
              {...field}
              name="rPassword"
              id="rPassword"
              inputClassName="text-input peer"
              placeholder={t("_entities:user.rPassword.placeholder")}
              label={t("_entities:user.rPassword.label")}
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
              inputClassName="text-input peer"
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
    </div>
  );
}

export default UserForm;
