import { useCallback, useState, useReducer, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

// icons
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import TranslationForm from "./components/TranslationForm";
import Loading from "../../partials/loading/Loading";
import TabComponent from "../../components/TabComponent/TabComponent";

const translationsReducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case "add": {
      const newState = { ...state };
      const { component, key } = action;
      newState[key] = component;
      return newState;
    }
    default:
      return state;
  }
};

/**
 *
 * @returns Translations page
 */
function Translations() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();
  const { setNotification } = useNotification();

  const appsQuery = useQuery({
    queryKey: [ReactQueryKeys.Applications],
    queryFn: () => museumApiClient.Application.getAll(),
  });

  const [currentApp, setCurrentApp] = useState(0);

  const [currentLanguage, setCurrentLanguage] = useState(0);
  const languagesQuery = useQuery({
    queryKey: [ReactQueryKeys.Languages],
    queryFn: () => museumApiClient.Language.getAll(),
  });

  const translationsQuery = useQuery({
    queryKey: [ReactQueryKeys.ApplicationTranslations, currentApp],
    queryFn: () => museumApiClient.ApplicationTranslation.getByApplication(currentApp),
    enabled: !!currentApp,
  });

  useEffect(() => {
    if (languagesQuery.data?.items) {
      setCurrentLanguage(languagesQuery.data?.items[0].id);
    }
  }, [languagesQuery.data]);

  const [translations, setTranslations] = useReducer(translationsReducer, {});

  useEffect(() => {
    const { data } = translationsQuery;

    const component = (
      <ul id={currentApp}>
        {data?.map((translation) => {
          return (
            <TranslationForm
              app={currentApp}
              language={currentLanguage}
              key={translation.id}
              {...translation}
            />
          );
        })}
      </ul>
    );

    setTranslations({ type: "add", key: currentApp, component });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentApp, translationsQuery.data, currentLanguage]);

  const onCSVSelected = useCallback(
    async (event) => {
      const [file] = event.target.files;
      const readFileContent = async (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      const content = await readFileContent(file);
      const response = await museumApiClient.ApplicationTranslation.uploadFile(content, currentApp);

      if (response.status === 201) {
        setNotification("200");
        queryClient.invalidateQueries([ReactQueryKeys.Translations, currentApp]);
      }
    },
    [currentApp, museumApiClient, setNotification],
  );

  useEffect(() => {
    setCurrentApp(appsQuery?.data?.items[0]?.id);
  }, [appsQuery?.data?.items]);

  return (
    <div className="p-7">
      <h3 className="mb-5">{t("_pages:translations.languages")}</h3>
      <ul className="flex gap-5 items-center justify-start w-full">
        {languagesQuery.data?.items?.map((language) => (
          <li key={language.id}>
            <button
              onClick={() => setCurrentLanguage(language.id)}
              className={`text-sm  px-5 py-2 ${currentLanguage === language.id ? "bg-slate-200 text-light-primary/60 disabled-link" : "text-primary hover:text-dark-primary"}`}
            >
              {language.code.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      {!appsQuery.isLoading && !translationsQuery.isLoading ? (
        <TabComponent
          onTabChange={(id) => setCurrentApp(id)}
          tabs={appsQuery.data?.items?.map((app) => ({ id: app.id, label: app.name })) ?? []}
          content={translations}
        />
      ) : (
        <Loading
          className="bg-none w-full h-6"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      )}
      <label className="fixed bottom-5 right-24 icon-button filled primary button cursor-pointer">
        <FontAwesomeIcon icon={faUpload} />
        <input type="file" accept=".csv" onChange={onCSVSelected} />
      </label>
    </div>
  );
}

export default Translations;
