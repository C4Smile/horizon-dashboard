import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import loadable from "@loadable/component";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import TabComponent from "../../components/TabComponent/TabComponent";

// types
import { techTabs } from "./types";

// tabs
import { GeneralInfo, ResourceStuff, TechsStuff } from "./tabs";

// entity
import { Tech } from "../../models/tech/Tech";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Tech Form page component
 * @returns Tech Form page component
 */
function TechForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const techQuery = useQuery({
    queryKey: [ReactQueryKeys.Techs, id],
    queryFn: () => horizonApiClient.Tech.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = techQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [techQuery]);

  const tabs = useMemo(
    () => techTabs.map((tab) => ({ id: tab, label: t(`_pages:techs.tabs.${tab}`) })),
    [t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo techQuery={techQuery} />,
      produces: (
        <ResourceStuff
          id={id}
          entity={Tech.className}
          entityToSave={Tech.resourceUpgrade}
          label={"production"}
          inputKey={"baseProduction"}
          queryKey={[ReactQueryKeys.TechProduces, id]}
          queryFn={() => horizonApiClient.Tech.getProductions(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.saveProductions(id, data)}
        />
      ),
      costs: (
        <ResourceStuff
          id={id}
          entity={Tech.className}
          entityToSave={Tech.costs}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.TechCosts, id]}
          queryFn={() => horizonApiClient.Tech.getCosts(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.saveCosts(id, data)}
        />
      ),
      techReqTechs: (
        <TechsStuff
          id={id}
          entity={Tech.className}
          entityToSave={Tech.techRequirement}
          label={"req"}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.techReqTechs, id]}
          queryFn={() => horizonApiClient.Tech.getReqTechs(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.saveReqTechs(id, data)}
        />
      ),
    }),
    [horizonApiClient, id, techQuery],
  );

  return notFound ? <NotFound /> : <TabComponent tabs={tabs} content={content} />;
}

export default TechForm;
