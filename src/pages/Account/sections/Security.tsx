import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";

// @sito/dasbhoard
import { Loading } from "@sito/dashboard-app";

// components
import { PasswordInput } from "components";

// providers
import { useAccount, useHorizonApiClient, useNotification } from "providers";

// api
import { isHttpRequestError } from "api";

// lib
import { NotificationEnumType, UserUpdateDto } from "lib";

type SecurityFormType = {
  password: string;
  rPassword: string;
};

/**
 * Security section
 * @returns Security component
 */
function Security() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { account } = useAccount();

  const userId = account.horizonUser?.userId;

  const { setNotification, showNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm<SecurityFormType>();

  const onSubmit = async (d: SecurityFormType) => {
    if (!userId) return;

    setSaving(true);
    try {
      if (d.password !== d.rPassword) {
        setSaving(false);
        showNotification({
          message: t("_accessibility:errors.passwordDoNotMatch"),
          type: NotificationEnumType.error,
        });
        return;
      }

      // the api throws on failure, a resolved call means it went through
      await horizonApiClient.User.update({ ...d, id: userId } as UserUpdateDto);
      setNotification("200", { model: t("_entities:entities.user") });
    } catch (e: unknown) {
      console.error(e);
      setNotification(
        isHttpRequestError(e) ? String(e.status) : "notConnected",
        { model: t("_entities:entities.user") },
      );
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form pt-10">
      <h2 className="text-1xl md:text-2xl font-bold mb-5">
        {t("_pages:settings.links.security")}
      </h2>
      <Controller
        control={control}
        disabled={saving}
        name="password"
        render={({ field }) => (
          <PasswordInput
            {...field}
            type="text"
            id="password"
            inputClassName="text-input peer"
            placeholder={t("_entities:user.password.placeholder")}
            label={t("_entities:user.password.label")}
            required
          />
        )}
      />
      <Controller
        control={control}
        disabled={saving}
        name="rPassword"
        render={({ field }) => (
          <PasswordInput
            {...field}
            type="text"
            id="rPassword"
            inputClassName="text-input peer"
            placeholder={t("_entities:user.rPassword.placeholder")}
            label={t("_entities:user.rPassword.label")}
            required
          />
        )}
      />
      <button type="submit" disabled={saving} className="mb-5 submit">
        {saving && (
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

export default Security;
