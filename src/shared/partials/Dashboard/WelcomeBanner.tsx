import { useTranslation } from "react-i18next";

// providers
import { useAccount } from "providers";

/**
 * WelcomeBanner
 * @returns React component
 */
export function WelcomeBanner() {
  const { t } = useTranslation();

  const { account } = useAccount();

  return (
    <div className="welcome-banner tile">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">
        {t("_pages:home.welcome")}, {account?.horizonUser?.name} 👋
      </h1>
      <p className="text-sm opacity-70">{t("_pages:home.subtitle")}</p>
    </div>
  );
}
