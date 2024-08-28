import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// api
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import Loading from "../../partials/loading/Loading";
import TabComponent from "../../components/TabComponent/TabComponent";

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
    queryKey: [ReactQueryKeys.Translations],
    queryFn: () => museumApiClient.ApplicationTranslation.getByApplication(currentApp),
    enabled: !!currentApp,
  });

  return (
    <div className="p-7">
      {!appsQuery.isLoading && !translationsQuery.isLoading ? (
        <TabComponent
          onTabChange={(id) => setCurrentApp(id)}
          tabs={appsQuery.data?.items?.map((app) => ({ id: app.id, label: app.name })) ?? []}
          content={{}}
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
