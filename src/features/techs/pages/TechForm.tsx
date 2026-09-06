import { useTranslation } from "react-i18next";

// lib
import {
  TechCostAddDto,
  TechProduceAddDto,
  TechReqBuildingAddDto,
  TechReqTechAddDto,
} from "../lib";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import loadable from "@loadable/component";

// providers
import { useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "utils";

// components
import { TabsLayout, EntityLevelStuff, ResourceStuff } from "components";

// types
import { techTabs } from "./types";

// tabs
import { GeneralInfo } from "./tabs";

// api
import { Tables, isHttpRequestError } from "api";

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

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
    queryFn: () => horizonApiClient.Tech.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = techQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [techQuery]);

  //#region resources

  const resourcesQuery = useQuery({
    queryKey: [ReactQueryKeys.Resources],
    queryFn: () => horizonApiClient.Resource.commonGet(),
  });

  const resourcesList = useMemo(() => {
    try {
      return (
        resourcesQuery?.data?.map((c) => ({
          value: c.name,
          id: c.id,
          image: c.image,
        })) ?? []
      );
    } catch {
      return [];
    }
  }, [resourcesQuery.data]);

  //#endregion resources

  //#region techs

  const techsQuery = useQuery({
    queryKey: [ReactQueryKeys.Techs],
    queryFn: () => horizonApiClient.Tech.commonGet(),
  });

  const techsList = useMemo(() => {
    try {
      return (
        techsQuery?.data
          ?.filter((c) => c.id !== Number(id))
          ?.map((c) => ({
            value: c.name,
            id: c.id,
            image: c.image,
          })) ?? []
      );
    } catch {
      return [];
    }
  }, [id, techsQuery?.data]);

  //#endregion techs

  //#region buildings

  const buildingsQuery = useQuery({
    queryKey: [ReactQueryKeys.Buildings],
    queryFn: () => horizonApiClient.Building.commonGet(),
  });

  const buildingsList = useMemo(() => {
    try {
      return (
        buildingsQuery?.data?.map((c) => ({
          value: c.name,
          id: c.id,
          image: c.image,
        })) ?? []
      );
    } catch {
      return [];
    }
  }, [buildingsQuery?.data]);

  //#endregion buildings

  const tabs = useMemo(
    () =>
      techTabs
        .filter((tab) => (tab.hide ? tab.hide(!!id) : true))
        .map(({ id: tabId }) => ({
          id: tabId,
          label: t(`_pages:techs.tabs.${tabId}`),
        })),
    [id, t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo techQuery={techQuery} />,
      produces: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Techs}
          entityToSave={Tables.TechProduces}
          label={"production"}
          inputKey={"baseProduction"}
          queryKey={[ReactQueryKeys.TechProduces, id]}
          queryFn={() => horizonApiClient.Tech.techProductions.get(Number(id))}
          saveFn={async (entityId, data: TechProduceAddDto) =>
            horizonApiClient.Tech.techProductions.insert(Number(entityId), data)
          }
          deleteFn={async (entityId, resourceId) =>
            horizonApiClient.Tech.techProductions.delete(Number(entityId), [
              resourceId,
            ])
          }
        />
      ),
      costs: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Techs}
          entityToSave={Tables.TechCosts}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.TechCosts, id]}
          queryFn={() => horizonApiClient.Tech.techCosts.get(Number(id))}
          saveFn={async (entityId, data: TechCostAddDto) =>
            horizonApiClient.Tech.techCosts.insert(Number(entityId), data)
          }
          deleteFn={async (entityId, resourceId) =>
            horizonApiClient.Tech.techCosts.delete(Number(entityId), [
              resourceId,
            ])
          }
        />
      ),
      techReqTechs: (
        <EntityLevelStuff
          id={Number(id)}
          entities={techsList}
          attributeId="techReqId"
          entity={Tables.Techs}
          entityToSave={Tables.TechReqTechs}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.TechRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Tech.techReqTechs.get(Number(id))}
          saveFn={async (entityId, data: TechReqTechAddDto) =>
            horizonApiClient.Tech.techReqTechs.insert(Number(entityId), data)
          }
          deleteFn={async (entityId, resourceId) =>
            horizonApiClient.Tech.techReqTechs.delete(Number(entityId), [
              resourceId,
            ])
          }
        />
      ),
      techReqBuildings: (
        <EntityLevelStuff
          id={Number(id)}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Tables.Buildings}
          entityToSave={Tables.TechReqBuildings}
          inputKey={"buildingLevel"}
          queryKey={[
            ReactQueryKeys.TechRequirements,
            ReactQueryKeys.Buildings,
            id,
          ]}
          queryFn={() => horizonApiClient.Tech.techReqBuildings.get(Number(id))}
          saveFn={async (entityId, data: TechReqBuildingAddDto) =>
            horizonApiClient.Tech.techReqBuildings.insert(
              Number(entityId),
              data,
            )
          }
          deleteFn={async (entityId, resourceId) =>
            horizonApiClient.Tech.techReqBuildings.delete(Number(entityId), [
              resourceId,
            ])
          }
        />
      ),
    }),
    [buildingsList, horizonApiClient, id, resourcesList, techQuery, techsList],
  );

  return notFound ? (
    <NotFound />
  ) : (
    <TabsLayout
      name={techQuery?.data?.name ?? ""}
      entity={ReactQueryKeys.Techs}
      id={Number(id)}
      tabs={tabs}
      content={content}
    />
  );
}

export default TechForm;
