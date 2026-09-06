import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// @sito/dashboard-app
import { AuthSignInView, isHttpError } from "@sito/dashboard-app";

// components
import { Logo } from "components";

// providers
import { useAccount, useHorizonApiClient, useNotification } from "providers";

// lib
import { NotificationEnumType } from "lib";

// pages
import { findPath, PageId } from "../../sitemap";

/**
 * Sign Page
 * @returns Sign component
 */
function SignIn() {
  const { t } = useTranslation();

  const { logUser } = useAccount();

  const horizonApiClient = useHorizonApiClient();

  const { showNotification } = useNotification();

  const navigate = useNavigate();

  return (
    <AuthSignInView
      title={t("_pages:auth.signIn.title")}
      logo={<Logo className="w-28 h-28 mb-10" />}
      emailLabel={t("_entities:user.email.label")}
      passwordLabel={t("_entities:user.password.label")}
      submitLabel={t("_accessibility:buttons.submit")}
      submitAriaLabel={t("_accessibility:ariaLabels.submit")}
      recoveryLabel={t("_pages:auth.signIn.passwordRecovery")}
      recoveryTo={findPath(PageId.recovery)}
      onSubmit={async (values) => {
        const session = await horizonApiClient.Auth.login(values);
        logUser(session, values.rememberMe);
        navigate(findPath(PageId.dashboard));
      }}
      onError={(error, { setError }) => {
        console.error(error);
        const status = isHttpError(error) ? error.status : undefined;

        // the server answers 404 when the user does not exist and 401/400
        // when the password is wrong
        if (status === 404)
          setError("email", {
            message: t("_accessibility:messages.404", {
              model: t("_entities:entities.user"),
            }),
          });
        else if (status === 401 || status === 400)
          setError("password", { message: t("_accessibility:messages.401") });
        else
          showNotification({
            message: t(
              `_accessibility:messages.${String(status ?? "notConnected")}`,
            ),
            type: NotificationEnumType.error,
          });
      }}
    />
  );
}

export default SignIn;
