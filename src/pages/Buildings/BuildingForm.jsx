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
import { buildingTabs } from "./types";

// tabs
import { GeneralInfo, ResourceStuff, TechsStuff, BuildingStuff } from "./tabs";

// entity
import { Tech } from "../../models/tech/Tech";
import { Building } from "../../models/building/Building";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Building Form page component
 * @returns Building Form page component
 */
function BuildingForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const buildingQuery = useQuery({
    queryKey: [ReactQueryKeys.Buildings, id],
    queryFn: () => horizonApiClient.Building.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = buildingQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [buildingQuery]);

  const tabs = useMemo(
    () => buildingTabs.map((tab) => ({ id: tab, label: t(`_pages:buildings.tabs.${tab}`) })),
    [t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo buildingQuery={buildingQuery} />,
      produces: (
        <ResourceStuff
          id={id}
          entity={Building.className}
          entityToSave={Building.resourceUpgrade}
          label={"production"}
          inputKey={"baseProduction"}
          queryKey={[ReactQueryKeys.BuildingProduces, id]}
          queryFn={() => horizonApiClient.Building.buildingProductions.get(id)}
          saveFn={async (id, data) => horizonApiClient.Building.buildingProductions.create(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Building.buildingProductions.deleteSingle(id, resourceId)
          }
        />
      ),
      costs: (
        <ResourceStuff
          id={id}
          entity={Building.className}
          entityToSave={Building.costs}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.BuildingCosts, id]}
          queryFn={() => horizonApiClient.Building.buildingCosts.get(id)}
          saveFn={async (id, data) => horizonApiClient.Building.buildingCosts.create(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Building.buildingCosts.deleteSingle(id, resourceId)
          }
        />
      ),
      upkeeps: (
        <ResourceStuff
          id={id}
          entity={Building.className}
          entityToSave={Building.upkeeps}
          label={"upkeep"}
          inputKey={"baseUpkeep"}
          queryKey={[ReactQueryKeys.BuildingUpkeeps, id]}
          queryFn={() => horizonApiClient.Building.buildingUpkeeps.get(id)}
          saveFn={async (id, data) => horizonApiClient.Building.buildingUpkeeps.create(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Building.buildingUpkeeps.deleteSingle(id, resourceId)
          }
        />
      ),
      buildingReqTechs: (
        <TechsStuff
          id={id}
          entity={Tech.className}
          entityToSave={Building.techRequirement}
          label={"req"}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.BuildingRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Building.buildingReqTechs.get(id)}
          saveFn={async (id, data) => horizonApiClient.Building.buildingReqTechs.create(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Building.buildingReqTechs.deleteSingle(id, resourceId)
          }
        />
      ),
      buildingReqBuildings: (
        <BuildingStuff
          id={id}
          entity={Building.className}
          entityToSave={Building.buildingRequirement}
          label={"req"}
          inputKey={"buildingLevel"}
          queryKey={[ReactQueryKeys.BuildingRequirements, ReactQueryKeys.Buildings, id]}
          queryFn={() => horizonApiClient.Building.buildingReqBuildings.get(id)}
          saveFn={async (id, data) => horizonApiClient.Building.buildingReqBuildings.create(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Building.buildingReqBuildings.deleteSingle(id, resourceId)
          }
        />
      ),
    }),
    [horizonApiClient, id, buildingQuery],
  );

  return notFound ? <NotFound /> : <TabComponent tabs={tabs} content={content} />;
}

export default BuildingForm;
