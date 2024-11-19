import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import loadable from "@loadable/component";

// components
import Loading from "../../../partials/loading/Loading";
import TextInput from "../../../components/Forms/TextInput";
import ImageUploader from "../../../components/ImageUploader";

// providers
import { useNotification } from "../../../providers/NotificationProvider";
import { useAccount } from "../../../providers/AccountProvider";
import { queryClient, useHorizonApiClient } from "../../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../../utils/queryKeys";

// pages
const NotFound = loadable(() => import("../../NotFound/NotFound"));

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

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState();

  const { handleSubmit, reset, control } = useForm();

  const [photo, setPhoto] = useState();

  const onSubmit = async (d) => {
    if (!photo) {
      setNotification("images", {}, "bad");
      return;
    }

    setSaving(true);
    try {
      const result = await horizonApiClient.User.update(d, photo);
      const { error, status } = result;

      setNotification(String(status), { model: t("_entities:entities.user") });
      setLastUpdate(new Date().toDateString());
      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error.message);
      else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Users, id] });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status), { model: t("_entities:entities.user") });
    }
    setSaving(false);
  };

  const userQuery = useQuery({
    queryKey: [ReactQueryKeys.Users, id],
    queryFn: () => horizonApiClient.User.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = userQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [userQuery]);

  useEffect(() => {
    if (userQuery.data) {
      if (userQuery.data?.image) setPhoto(userQuery?.data?.image);
      reset({ ...userQuery.data });
      setLastUpdate(userQuery?.data?.lastUpdate);
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
        address: "",
        identification: "",
      });
    }
  }, [id, reset, userQuery.data]);

  return notFound ? (
    <NotFound />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2 className="text-1xl md:text-2xl font-bold">{t("_pages:settings.links.account")}</h2>
      {userQuery.isLoading ? (
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
              {t("_accessibility:labels.lastUpdate")} {new Date(lastUpdate).toLocaleDateString("es-ES")}
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
            inputClassName="text-input peer"
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
            inputClassName="text-input peer"
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
            label={`${t("_entities:user.imageId.label")}`}
            folder={`${ReactQueryKeys.Users}`}
          />
        )}
      </div>

      <button type="submit" disabled={userQuery.isLoading || saving} className="mb-5 submit">
        {(userQuery.isLoading || saving) && (
          <Loading className="button-loading" strokeWidth="4" loaderClass="!w-6" color="stroke-white" />
        )}
        {t("_accessibility:buttons.save")}
      </button>
    </form>
  );
}

export default PersonalInfo;
