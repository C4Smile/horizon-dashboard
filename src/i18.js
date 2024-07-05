import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { namespaces } from "./lang/nameSpaces";

// resources
// es
import esAccessibility from "./lang/es/_accessibility.json";
import esEntities from "./lang/es/_entities.json";
import esPages from "./lang/es/_pages.json";
// en
import enAccessibility from "./lang/en/_accessibility.json";
import enEntities from "./lang/en/_entities.json";
import enPages from "./lang/en/_pages.json";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "es",
    supportedLngs: ["es"],
    ns: namespaces,
    defaultNS: "_pages",
    resources: {
      en: {
        _accessibility: enAccessibility,
        _pages: enPages,
        _entities: enEntities,
      },
      es: {
        _accessibility: esAccessibility,
        _pages: esPages,
        _entities: esEntities,
      },
    },
  });

export default i18n;
