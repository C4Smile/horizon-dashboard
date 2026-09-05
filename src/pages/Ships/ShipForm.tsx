import { useTranslation } from "react-i18next";

// lib
import { ShipCostAddDto, ShipReqBuildingAddDto, ShipReqTechAddDto, ShipUpkeepAddDto } from "lib";
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
import { shipTabs } from "./types.js";

// tabs
import { GeneralInfo } from "./tabs/";

// api
import { Tables, isHttpRequestError } from "api";

// pages
const NotFound = loadable(() => import("../NotFound/NotFound"));

/**
 * Building Form page component
 * @returns Building Form page component
 */
function ShipForm() {
  const { id } = useParams();

  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const [notFound, setNotFound] = useState(false);

  const shipQuery = useQuery({
    queryKey: [ReactQueryKeys.Ships, id],
    queryFn: () => horizonApiClient.Ship.getById(Number(id)),
    enabled: id !== undefined,
  });

  useEffect(() => {
    // the api throws instead of answering { data, status }, so the failure
    // shows up as the query error, never as a field on data
    const { error } = shipQuery;
    if (!error) return;

    console.error(error);
    if (isHttpRequestError(error) && error.status === 404) setNotFound(true);
  }, [shipQuery]);

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

  //#region ships

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
      shipTabs
        .filter((tab) => (tab.hide ? tab.hide(!!id) : true))
        .map(({ id }) => ({
          id,
          label: t(`_pages:ships.tabs.${id}`),
        })),
    [id, t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo shipQuery={shipQuery} />,
      costs: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Ships}
          entityToSave={Tables.ShipCosts}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.ShipCosts, id]}
          queryFn={() => horizonApiClient.Ship.shipCosts.get(Number(id))}
          saveFn={async (id, data: ShipCostAddDto) =>
            horizonApiClient.Ship.shipCosts.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipCosts.delete(Number(id), [resourceId])
          }
        />
      ),
      upkeep: (
        <ResourceStuff
          id={Number(id)}
          resources={resourcesList}
          entity={Tables.Ships}
          entityToSave={Tables.ShipUpkeeps}
          label={"upkeep"}
          inputKey={"baseUpkeep"}
          queryKey={[ReactQueryKeys.ShipUpkeeps, id]}
          queryFn={() => horizonApiClient.Ship.shipUpkeeps.get(Number(id))}
          saveFn={async (id, data: ShipUpkeepAddDto) =>
            horizonApiClient.Ship.shipUpkeeps.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipUpkeeps.delete(Number(id), [resourceId])
          }
        />
      ),
      shipReqTechs: (
        <EntityLevelStuff
          id={Number(id)}
          entities={techsList}
          attributeId="techReqId"
          entity={Tables.Techs}
          entityToSave={Tables.ShipReqTechs}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.ShipRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Ship.shipReqTechs.get(Number(id))}
          saveFn={async (id, data: ShipReqTechAddDto) =>
            horizonApiClient.Ship.shipReqTechs.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipReqTechs.delete(Number(id), [resourceId])
          }
        />
      ),
      shipReqBuildings: (
        <EntityLevelStuff
          id={Number(id)}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Tables.Ships}
          entityToSave={Tables.ShipReqBuildings}
          inputKey={"buildingLevel"}
          queryKey={[
            ReactQueryKeys.ShipRequirements,
            ReactQueryKeys.Buildings,
            id,
          ]}
          queryFn={() => horizonApiClient.Ship.shipReqBuildings.get(Number(id))}
          saveFn={async (id, data: ShipReqBuildingAddDto) =>
            horizonApiClient.Ship.shipReqBuildings.insert(Number(id), data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipReqBuildings.delete(Number(id), [resourceId])
          }
        />
      ),
    }),
    [shipQuery, id, resourcesList, techsList, buildingsList, horizonApiClient],
  );

  return notFound ? (
    <NotFound />
  ) : (
    <TabsLayout
      name={shipQuery?.data?.name}
      entity={ReactQueryKeys.Ships}
      id={Number(id)}
      tabs={tabs}
      content={content}
    />
  );
}

export default ShipForm;
