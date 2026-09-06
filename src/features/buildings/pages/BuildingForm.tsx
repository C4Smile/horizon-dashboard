import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import loadable from "@loadable/component";

// providers
import { useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "utils/queryKeys";

// components
import { TabsLayout, EntityLevelStuff, ResourceStuff } from "components";

// types
import { buildingTabs } from "./types.js";

// tabs
import { GeneralInfo } from "./tabs/";

// api
import { Tables, isHttpRequestError } from "api";

// lib
import {
  BuildingCostAddDto,
  BuildingProduceAddDto,
  BuildingReqBuildingAddDto,
  BuildingReqTechAddDto,
  BuildingUpkeepAddDto,
} from "../lib";

// pages
const NotFound = loadable(() => import("components/NotFound/NotFound"));

/**
 * Building Form page component
 * @returns Building Form page component
 */
function BuildingForm() {
  const { id: paramId } = useParams();

  const id = useMemo(() => Number(paramId), [paramId]);

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const buildingQuery = useQuery({
    queryKey: [ReactQueryKeys.Buildings, id],
    queryFn: () => horizonApiClient.Building.getById(Number(id)),
    // on /new there is no param, Number(undefined) is NaN and the api rejects it
    enabled: !Number.isNaN(id),
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = buildingQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [buildingQuery]);

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
    } catch (err) {
      console.error(err);
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
        techsQuery?.data?.map((c) => ({
          value: c.name,
          id: c.id,
          image: c.image,
        })) ?? []
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [techsQuery.data]);

  //#endregion techs

  //#region buildings

  const buildingsQuery = useQuery({
    queryKey: [ReactQueryKeys.Buildings],
    queryFn: () => horizonApiClient.Building.commonGet(),
  });

  const buildingsList = useMemo(() => {
    try {
      return (
        buildingsQuery?.data
          ?.filter((c) => c.id !== Number(id))
          ?.map((c) => ({
            value: c.name,
            id: c.id,
            image: c.image,
          })) ?? []
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [buildingsQuery?.data, id]);

  //#endregion buildings

  const tabs = useMemo(
    () =>
      buildingTabs
        .filter((tab) => (tab.hide ? tab.hide(!!id) : true))
        .map(({ id }) => ({
          // the tab id is the content key, not a number
          id,
          label: t(`_pages:buildings.tabs.${id}`),
        })),
    [id, t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo buildingQuery={buildingQuery} />,
      produces: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Buildings}
          entityToSave={Tables.BuildingProduces}
          label={"production"}
          inputKey={"base"}
          queryKey={[ReactQueryKeys.BuildingProduces, id]}
          queryFn={() =>
            horizonApiClient.Building.buildingProductions.get(Number(id))
          }
          saveFn={async (id: number, data: BuildingProduceAddDto) =>
            horizonApiClient.Building.buildingProductions.insert(
              Number(id),
              data,
            )
          }
          deleteFn={async (id: number, resourceId: number) =>
            horizonApiClient.Building.buildingProductions.delete(Number(id), [
              resourceId,
            ])
          }
        />
      ),
      costs: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Buildings}
          entityToSave={Tables.BuildingCosts}
          label={"cost"}
          inputKey={"base"}
          queryKey={[ReactQueryKeys.BuildingCosts, id]}
          queryFn={() =>
            horizonApiClient.Building.buildingCosts.get(Number(id))
          }
          saveFn={async (id: number, data: BuildingCostAddDto) =>
            horizonApiClient.Building.buildingCosts.insert(Number(id), data)
          }
          deleteFn={async (id: number, resourceId: number) =>
            horizonApiClient.Building.buildingCosts.delete(Number(id), [
              resourceId,
            ])
          }
        />
      ),
      upkeep: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Buildings}
          entityToSave={Tables.BuildingUpkeeps}
          label={"upkeep"}
          inputKey={"base"}
          queryKey={[ReactQueryKeys.BuildingUpkeeps, id]}
          queryFn={() =>
            horizonApiClient.Building.buildingUpkeeps.get(Number(id))
          }
          saveFn={async (id: number, data: BuildingUpkeepAddDto) =>
            horizonApiClient.Building.buildingUpkeeps.insert(Number(id), data)
          }
          deleteFn={async (id: number, resourceId: number) =>
            horizonApiClient.Building.buildingUpkeeps.delete(Number(id), [
              resourceId,
            ])
          }
        />
      ),
      buildingReqTechs: (
        <EntityLevelStuff
          id={Number(id)}
          entities={techsList}
          attributeId="techReqId"
          entity={Tables.Techs}
          entityToSave={Tables.BuildingReqTechs}
          inputKey={"level"}
          queryKey={[
            ReactQueryKeys.BuildingRequirements,
            ReactQueryKeys.Techs,
            id,
          ]}
          queryFn={() =>
            horizonApiClient.Building.buildingReqTechs.get(Number(id))
          }
          saveFn={async (id: number, data: BuildingReqTechAddDto) =>
            horizonApiClient.Building.buildingReqTechs.insert(Number(id), data)
          }
          deleteFn={async (id: number, techId: number) =>
            horizonApiClient.Building.buildingReqTechs.delete(Number(id), [
              techId,
            ])
          }
        />
      ),
      buildingReqBuildings: (
        <EntityLevelStuff
          id={Number(id)}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Tables.Buildings}
          entityToSave={Tables.BuildingReqBuildings}
          inputKey={"level"}
          queryKey={[
            ReactQueryKeys.BuildingRequirements,
            ReactQueryKeys.Buildings,
            id,
          ]}
          queryFn={() =>
            horizonApiClient.Building.buildingReqBuildings.get(Number(id))
          }
          saveFn={async (id: number, data: BuildingReqBuildingAddDto) =>
            horizonApiClient.Building.buildingReqBuildings.insert(
              Number(id),
              data,
            )
          }
          deleteFn={async (id: number, buildingId: number) =>
            horizonApiClient.Building.buildingReqBuildings.delete(Number(id), [
              buildingId,
            ])
          }
        />
      ),
    }),
    [
      buildingQuery,
      id,
      resourcesList,
      techsList,
      buildingsList,
      horizonApiClient,
    ],
  );

  return notFound ? (
    <NotFound />
  ) : (
    <TabsLayout
      name={buildingQuery?.data?.name ?? ""}
      entity={ReactQueryKeys.Buildings}
      id={Number(id)}
      tabs={tabs}
      content={content}
    />
  );
}

export default BuildingForm;
