import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * Not found page
 * @returns Not found page
 */
function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="appear h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl xs:text-5xl text-center mb-5">404 - {t("_pages:notFound:title")}</h1>
      <Link to="/" className="submit !w-20">
        {t("_accessibility:buttons.goHome")}
      </Link>
    </main>
  );
}

export default NotFound;
