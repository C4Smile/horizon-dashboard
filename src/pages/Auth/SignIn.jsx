import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import PasswordInput from "../../components/Forms/PasswordInput";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// images
import logoVertical from "../../assets/images/logo-vertical.png";

/**
 * Sign Page
 * @returns Sign component
 */
function SignIn() {
  const { t } = useTranslation();

  const [appear, setAppear] = useState(false);

  const museumApiClient = useMuseumApiClient();

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { handleSubmit, reset, control } = useForm();

  const onSubmit = async (d) => {
    setError("");
    setSaving(true);
    try {
      let result;
      if (d.id) result = await museumApiClient.Customer.create(d);
      else result = await museumApiClient.Customer.update(d);
      const { error, status } = result;
      // set server status to notification

      // eslint-disable-next-line no-console
      if (error && error !== null) console.error(error);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      // set server status to notification
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
        className="w-2/5 max-sm:w-10/12 px-5 pt-10 flex flex-col items-center justify-start"
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
              />
            )}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`mb-5 relative text-white self-start bg-light-primary transition-all enabled:hover:bg-primary enabled:focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 duration-500 ease-in-out delay-[400ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
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
