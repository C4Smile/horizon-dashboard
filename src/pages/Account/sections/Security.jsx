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
    <form onSubmit={handleSubmit(onSubmit)} className="flex-col pt-10 flex items-start justify-start">
      <h2 className="text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
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
        disabled={saving}
        name="rPassword"
        render={({ field }) => (
          <PasswordInput
            {...field}
            type="text"
            name="rPassword"
            id="rPassword"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder={t("_entities:user.rPassword.placeholder")}
            label={t("_entities:user.rPassword.label")}
            required
          />
        )}
      />
      <button
        type="submit"
        disabled={saving}
        className="mb-5 relative text-white bg-light-primary transition enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {saving && (
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
  );
}

export default Security;
