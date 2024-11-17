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
import { EntityLevelStuff } from "../../components/EntityLevelStuff/index.js";

// types
import { buildingTabs } from "./types";

// tabs
import { GeneralInfo, ResourceStuff } from "./tabs";

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

  //#region resources

  const resourcesQuery = useQuery({
    queryKey: [ReactQueryKeys.Resources],
    queryFn: () => horizonApiClient.Resource.getAll(),
  });

  const resourcesList = useMemo(() => {
    try {
      return (
        resourcesQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id, image: c.image })) ??
        []
      );
    } catch (err) {
      return [];
    }
  }, [resourcesQuery.data]);

  //#endregion resources

  //#region techs

  const techsQuery = useQuery({
    queryKey: [ReactQueryKeys.Techs],
    queryFn: () => horizonApiClient.Tech.getAll(),
  });

  const techsList = useMemo(() => {
    try {
      return (
        techsQuery?.data?.items?.map((c) => ({ value: `${c.name}`, id: c.id, image: c.image })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [techsQuery.data]);

  //#endregion techs

  //#region buildings

  const buildingsQuery = useQuery({
    queryKey: [ReactQueryKeys.Buildings],
    queryFn: () => horizonApiClient.Building.getAll(),
  });

  const buildingsList = useMemo(() => {
    try {
      return (
        buildingsQuery?.data?.items
          ?.filter((c) => c.id !== Number(id))
          ?.map((c) => ({
            value: `${c.name}`,
            id: c.id,
            image: c.image,
          })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [buildingsQuery?.data?.items, id]);

  //#endregion buildings

  const tabs = useMemo(
    () =>
      buildingTabs
        .filter((tab) => (tab.hide ? tab.hide(!!id) : true))
        .map(({ id }) => ({
          id: id,
          label: t(`_pages:buildings.tabs.${id}`),
        })),
    [id, t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo buildingQuery={buildingQuery} />,
      produces: (
        <ResourceStuff
          id={id}
          resources={resourcesList}
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
          resources={resourcesList}
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
      upkeep: (
        <ResourceStuff
          id={id}
          resources={resourcesList}
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
        <EntityLevelStuff
          id={id}
          entities={techsList}
          attributeId="techReqId"
          entity={Tech.className}
          entityToSave={Building.techRequirement}
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
        <EntityLevelStuff
          id={id}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Building.className}
          entityToSave={Building.buildingRequirement}
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
    [buildingQuery, id, resourcesList, techsList, buildingsList, horizonApiClient],
  );

  return notFound ? <NotFound /> : <TabComponent tabs={tabs} content={content} />;
}

export default BuildingForm;
