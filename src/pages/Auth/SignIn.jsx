import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import PasswordInput from "../../components/Forms/PasswordInput";

// providers
import { useAccount } from "../../providers/AccountProvider";
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// images
import logoVertical from "../../assets/images/logo-vertical.png";

/**
 * Sign Page
 * @returns Sign component
 */
function SignIn() {
  const { t } = useTranslation();

  const { logUser } = useAccount();

  const [appear, setAppear] = useState(false);

  const museumApiClient = useMuseumApiClient();

  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm();

  const { setNotification } = useNotification();

  const onSubmit = async (d) => {
    setUserError("");
    setPasswordError("");
    setSaving(true);
    try {
      const result = await museumApiClient.User.login(d.email, d.password);
      const data = await result.json();
      // set server status to notification
      if (data.statusCode) {
        if (data.statusCode === 404)
          setUserError(t(`_accessibility:messages.404`, { model: t("_entities:entities.user") }));
        else if (data.statusCode === 401 || data.statusCode === 400)
          setPasswordError(t("_accessibility:messages.401"));
      } else logUser({ ...data, username: d.username });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      // set server status to notification
      if (e.status) setNotification(String(e.status));
      else setNotification(String(e));
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
        className="w-3/5 max-sm:w-10/12 px-5 pt-10 flex flex-col items-center justify-start"
      >
        <img
          src={logoVertical}
          alt="logo del museo"
          className={`w-28 mb-10 transition-all duration-500 ease-in-out ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        />
        <h1
          className={`w-full text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-5 transition-all duration-500 ease-in-out delay-100 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          {t("_pages:auth.signIn.title")}
        </h1>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-200 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="username"
            render={({ field }) => (
              <TextInput
                {...field}
                type="text"
                name="username"
                id="username"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                label={t("_entities:user.username.label")}
                required
                helperText={userError}
                state={userError.length ? "error" : ""}
              />
            )}
          />
        </div>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-300 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="password"
            render={({ field }) => (
              <PasswordInput
                {...field}
                name="password"
                id="password"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                label={t("_entities:user.password.label")}
                required
                helperText={passwordError}
                state={passwordError.length ? "error" : ""}
              />
            )}
          />
        </div>
        <div className="w-full mb-5">
          <Link
            to="/auth/recovery"
            className={`underline text-left transition-all duration-500 ease-in-out delay-[400ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
          >
            {t("_pages:auth.signIn.passwordRecovery")}
          </Link>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`mb-5 relative text-white self-start bg-light-primary transition-all enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 duration-500 ease-in-out delay-[500ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
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
    </div>
  );
}

export default SignIn;
