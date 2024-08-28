import { useMemo, useState, useReducer, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// api
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

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
  const museumApiClient = useMuseumApiClient();

  const appsQuery = useQuery({
    queryKey: [ReactQueryKeys.Applications],
    queryFn: () => museumApiClient.Application.getAll(),
  });

  const [currentApp, setCurrentApp] = useState(0);

  const translationsQuery = useQuery({
    queryKey: [ReactQueryKeys.Translations, currentApp],
    queryFn: () => museumApiClient.ApplicationTranslation.getByApplication(currentApp),
    enabled: !!currentApp,
  });

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

    setTranslations({ type: "add", key: currentApp, component });
  }, [currentApp, translationsQuery.data]);

  console.log(translations);

  return (
    <div className="p-7">
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
    </div>
  );
}

export default Translations;
