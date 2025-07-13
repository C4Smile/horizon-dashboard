import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Loading, State, TextInput } from "@sito/dashboard";

// components
import { Logo, PasswordInput } from "components";

// providers
import { useAccount, useNotification, useHorizonApiClient } from "providers";

// pages
import { findPath, PageId } from "../sitemap";

// api
import { HTTPError } from "api";

// lib
import { AccountDto, LoginDto, NotificationEnumType } from "lib";

/**
 * Sign Page
 * @returns Sign component
 */
function SignIn() {
  const { t } = useTranslation();

  const { logUser } = useAccount();

  const [appear, setAppear] = useState(false);

  const horizonApiClient = useHorizonApiClient();

  const [saving, setSaving] = useState(false);

  const { handleSubmit, control, setError } = useForm<LoginDto>();

  const mutationFn = useMutation<AccountDto, HTTPError, LoginDto>({
    mutationFn: (data) => horizonApiClient.Auth.login(data),
    onError: (error) => {
      console.error(error);
      if (error) {
        const messages = parseFormError(error);
        showStackNotifications(
          messages.map(
            (message) =>
              ({
                message,
                type: NotificationEnumType.error,
              }) as NotificationType
          )
        );
      }
      if (onError) onError(error);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey });
      if (onSuccess) onSuccess(result);
      showSuccessNotification({
        message: onSuccessMessage,
      } as NotificationType);
      close();
    },
  });

  const { showNotification } = useNotification();

  const onSubmit = async (d: LoginDto) => {
    setSaving(true);
    try {
      const result = await horizonApiClient.Auth.login(d.username, d.password);
      const data = await result.json();
      // set server status to notification
      if (data.status) {
        if (data.status === 404)
          setError("username", {
            message: t(`_accessibility:messages.404`, {
              model: t("_entities:entities.user"),
            }),
          });
        else if (data.status === 401 || data.status === 400)
          setError("password", { message: t("_accessibility:messages.401") });
        else {
          const request = await horizonApiClient.Auth.fetchOwner(data.user.id);
          const horizonUser = await request.json();
          if (horizonUser) logUser({ ...data, horizonUser });
          else logUser({ ...data });
        }
      }
    } catch (e: unknown) {
      console.error(e);
      // set server status to notification
      showNotification({
        message: t(
          `_accessibility:messages.${String((e as HTTPError).status ?? "notConnected")}`
        ),
        type: NotificationEnumType.error,
      });
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
        className="w-96 max-sm:w-10/12 p-5 flex flex-col items-center justify-start m-auto mt-40 bg-light-background"
      >
        <Logo
          className={`w-28 h-28 mb-10 transition-all duration-500 ease-in-out ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        />
        <h1
          className={`w-full text-2xl md:text-3xl mb-5 transition-all duration-500 ease-in-out delay-200 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          {t("_pages:auth.signIn.title")}
        </h1>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-300 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="username"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                type="text"
                id="email"
                label={t("_entities:user.email.label")}
                required
                helperText={fieldState.error?.message}
                state={userError.length ? State.error : State.default}
              />
            )}
          />
        </div>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-[400ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="password"
            render={({ field }) => (
              <PasswordInput
                {...field}
                id="password"
                label={t("_entities:user.password.label")}
                required
                helperText={passwordError}
                state={passwordError.length ? State.error : State.default}
              />
            )}
          />
        </div>
        <div className="w-full mb-5">
          <Link
            to={findPath(PageId.recovery)}
            className={`underline text-left transition-all duration-500 ease-in-out delay-[500ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
          >
            {t("_pages:auth.signIn.passwordRecovery")}
          </Link>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`mb-5 self-start duration-500 ease-in-out delay-[600ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"} submit`}
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

export default SignIn;
