import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createCookie } from "some-javascript-utils/browser";

// components
import Logo from "../../components/Logo/Logo";
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

import config from "../../config";

// pages
import { findPath, pageId } from "../sitemap";

/**
 * Recovery page
 * @returns Recovery page component
 */
function Recovery() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [appear, setAppear] = useState(false);
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm();

  const { setNotification } = useNotification();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      const response = await horizonApiClient.User.recovery(d.email);
      const data = await response.json();
      if (data !== null && data.status) setNotification(String(data.status));
      else {
        setNotification(t("_pages:auth.recovery.sent"), {}, "good");
        createCookie(config.recovering, 1, d.email);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      // set server status to notification
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 1100);
  }, []);

  return (
    <div className="w-full h-screen flex items-start justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-3/5 max-sm:w-10/12 px-5 flex flex-col items-center justify-start m-auto"
      >
        <Link to={findPath(pageId.auth)}>
          <Logo
            className={`md:mt-5 w-28 mb-10 transition-all duration-500 ease-in-out ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
          />
        </Link>
        <h1
          className={`w-full text-2xl md:text-3xl text-slate-800 font-bold mb-5 transition-all duration-500 ease-in-out delay-100 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          {t("_pages:auth.recovery.title")}
        </h1>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-200 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="email"
            render={({ field }) => (
              <TextInput
                {...field}
                type="email"
                name="email"
                id="email"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                label={t("_entities:user.email.label")}
                required
              />
            )}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`submit primary delay-[500ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          {saving && (
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

export default Recovery;
