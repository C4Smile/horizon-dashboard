import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";

// components
import Loading from "../../../partials/loading/Loading";
import PasswordInput from "../../../components/Forms/PasswordInput";

// providers
import { useNotification } from "../../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../../providers/MuseumApiProvider";

// utils
import { fromLocal } from "../../../utils/local";
import config from "../../../config";

/**
 * Security section
 * @returns Security component
 */
function Security() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const userId = fromLocal(config.user, "object")?.id;

  const { setNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      if (d.password !== d.rPassword) {
        setSaving(false);
        // eslint-disable-next-line no-console
        console.error(t("_accessibility:errors.passwordDoNotMatch"));
        return setNotification(t("_accessibility:errors.passwordDoNotMatch"));
      }
      const { error, status } = await museumApiClient.User.update({ ...d, id: userId });
      setNotification(String(status));

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form pt-10">
      <h2 className="text-1xl md:text-2xl font-bold mb-5">{t("_pages:settings.links.security")}</h2>
      <Controller
        control={control}
        disabled={saving}
        name="password"
        render={({ field }) => (
          <PasswordInput
            {...field}
            type="text"
            name="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
            name="rPassword"
            id="rPassword"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.rPassword.placeholder")}
            label={t("_entities:user.rPassword.label")}
            required
          />
        )}
      />
      <button type="submit" disabled={saving} className="mb-5 submit">
        {saving && (
          <Loading className="button-loading" strokeWidth="4" loaderClass="!w-6" color="stroke-white" />
        )}
        {t("_accessibility:buttons.save")}
      </button>
    </form>
  );
}

export default Security;
