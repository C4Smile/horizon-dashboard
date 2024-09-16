import { useCallback, useState, useReducer, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

// icons
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// api
import { queryClient, useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import Loading from "../../partials/loading/Loading";
import TabComponent from "../../components/TabComponent/TabComponent";
import TranslationForm from "./components/TranslationForm";

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

  const appsQuery = useQuery({
    queryKey: [ReactQueryKeys.Applications],
    queryFn: () => museumApiClient.Application.getAll(),
  });

  const [currentApp, setCurrentApp] = useState(0);

  const [currentLanguage, setCurrentLanguage] = useState(0);
  const languagesQuery = useQuery({
    queryKey: [ReactQueryKeys.Language],
    queryFn: () => museumApiClient.Language.getAll(),
  });

  const translationsQuery = useQuery({
    queryKey: [ReactQueryKeys.Translations, currentApp],
    queryFn: () => museumApiClient.ApplicationTranslation.getByApplication(currentApp),
    enabled: !!currentApp,
  });

  useEffect(() => {
    if (languagesQuery.data?.items) {
      setCurrentLanguage(languagesQuery.data?.items[0].id);
    }
  }, [languagesQuery.data?.items]);

  const [translations, setTranslations] = useReducer(translationsReducer, {});

  useEffect(() => {
    const { data } = translationsQuery;
    const component = (
      <ul id={currentApp}>
        {data?.items?.map((translation) => (
          <TranslationForm key={translation.id} {...translation} />
        ))}
      </ul>
    );
    console.log(data);
    setTranslations({ type: "add", key: currentApp, component });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentApp, translationsQuery.data]);

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
        queryClient.invalidateQueries([ReactQueryKeys.Translations, currentApp]);
      }
    },
    [currentApp, museumApiClient.ApplicationTranslation],
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
              onClick={() => setCurrentLanguage(language.code)}
              className={`text-sm  px-5 py-2 ${currentLanguage === language.code ? "bg-slate-200 text-light-primary/60 disabled-link" : "text-primary hover:text-dark-primary"}`}
            >
              {language.code}
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
      <label className="absolute bottom-3 right-3 icon-button filled primary button cursor-pointer">
        <FontAwesomeIcon icon={faUpload} />
        <input type="file" accept=".csv" onChange={onCSVSelected} />
      </label>
    </div>
  );
}

export default Translations;
