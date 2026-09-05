import { useTranslation } from "react-i18next";

// lib
import { CannonCostAddDto, CannonReqBuildingAddDto, CannonReqTechAddDto } from "lib";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import loadable from "@loadable/component";

// providers
import { useHorizonApiClient } from "providers";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys.js";

// components
import { TabsLayout, EntityLevelStuff, ResourceStuff } from "components";

// types
import { cannonTabs } from "./types.js";

// tabs
import { GeneralInfo } from "./tabs";

// api
import { Tables, isHttpRequestError } from "api";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Building Form page component
 * @returns Building Form page component
 */
function CannonForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const cannonQuery = useQuery({
    queryKey: [ReactQueryKeys.Cannons, id],
    queryFn: () => horizonApiClient.Cannon.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = cannonQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [cannonQuery]);

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
      return [];
    }
  }, [techsQuery.data]);

  //#endregion techs

  //#region cannons

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
    } catch (err) {
      return [];
    }
  }, [buildingsQuery?.data]);

  //#endregion buildings

  const tabs = useMemo(
    () =>
      cannonTabs
        .filter((tab) => (tab.hide ? tab.hide(!!id) : true))
        .map(({ id }) => ({
          id,
          label: t(`_pages:cannons.tabs.${id}`),
        })),
    [id, t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo cannonQuery={cannonQuery} />,
      costs: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Cannons}
          entityToSave={Tables.CannonCosts}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.CannonCosts, id]}
          queryFn={() => horizonApiClient.Cannon.cannonCosts.get(Number(id))}
          saveFn={async (id, data: CannonCostAddDto) =>
            horizonApiClient.Cannon.cannonCosts.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Cannon.cannonCosts.delete(Number(id), [resourceId])
          }
        />
      ),
      cannonReqTechs: (
        <EntityLevelStuff
          id={Number(id)}
          entities={techsList}
          attributeId="techReqId"
          entity={Tables.Techs}
          entityToSave={Tables.CannonReqTechs}
          inputKey={"techLevel"}
          queryKey={[
            ReactQueryKeys.CannonRequirements,
            ReactQueryKeys.Techs,
            id,
          ]}
          queryFn={() => horizonApiClient.Cannon.cannonReqTechs.get(Number(id))}
          saveFn={async (id, data: CannonReqTechAddDto) =>
            horizonApiClient.Cannon.cannonReqTechs.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Cannon.cannonReqTechs.delete(Number(id), [resourceId])
          }
        />
      ),
      cannonReqBuildings: (
        <EntityLevelStuff
          id={Number(id)}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Tables.Cannons}
          entityToSave={Tables.CannonReqBuildings}
          inputKey={"buildingLevel"}
          queryKey={[
            ReactQueryKeys.CannonRequirements,
            ReactQueryKeys.Buildings,
            id,
          ]}
          queryFn={() => horizonApiClient.Cannon.cannonReqBuildings.get(Number(id))}
          saveFn={async (id, data: CannonReqBuildingAddDto) =>
            horizonApiClient.Cannon.cannonReqBuildings.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Cannon.cannonReqBuildings.deleteSingle(
              id,
              resourceId,
            )
          }
        />
      ),
    }),
    [
      cannonQuery,
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
      name={cannonQuery?.data?.name ?? ""}
      entity={ReactQueryKeys.Cannons}
      id={Number(id)}
      tabs={tabs}
      content={content}
    />
  );
}

export default CannonForm;
