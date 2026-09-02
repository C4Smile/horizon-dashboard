import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate, type To } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  AppProviders,
  queryClient,
  TranslationProvider,
} from "@sito/dashboard-app";

// api
import { Manager } from "api";

// config
import config from "../config";

// types
import { HorizonProviderPropsType } from "./types";

/**
 * Root provider, wires the shared dashboard-app provider tree with horizon's
 * manager, router and translations
 * @param props - provider props
 * @returns Horizon provider
 */
export const HorizonProvider = (props: HorizonProviderPropsType) => {
  const { children } = props;

  const { t, i18n } = useTranslation();

  const [manager] = useState(() => new Manager());

  const navigate = useNavigate();
  const location = useLocation();

  const navigateFn = useCallback(
    (route: string | number) => navigate(route as To),
    [navigate],
  );

  return (
    <AppProviders
      config={{
        location,
        navigate: navigateFn,
        linkComponent: Link,
      }}
      manager={{ manager, queryClient }}
      auth={{ user: config.user, remember: config.remember }}
      withNavbarProvider
    >
      <TranslationProvider t={t} language={i18n.language}>
        {children}
      </TranslationProvider>
    </AppProviders>
  );
};
