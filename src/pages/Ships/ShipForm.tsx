import { useTranslation } from "react-i18next";
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
const NotFound = loadable(() => import("../NotFound/NotFound.jsx"));

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
    queryFn: () => horizonApiClient.Ship.getById(id),
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
          id={id}
          resources={resourcesList}
          entity={Tables.Ships}
          entityToSave={Tables.ShipCosts}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.ShipCosts, id]}
          queryFn={() => horizonApiClient.Ship.shipCosts.get(id)}
          saveFn={async (id, data) =>
            horizonApiClient.Ship.shipCosts.insert(id, data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipCosts.delete(id, [resourceId])
          }
        />
      ),
      upkeep: (
        <ResourceStuff
          id={id}
          resources={resourcesList}
          entity={Tables.Ships}
          entityToSave={Tables.ShipUpkeeps}
          label={"upkeep"}
          inputKey={"baseUpkeep"}
          queryKey={[ReactQueryKeys.ShipUpkeeps, id]}
          queryFn={() => horizonApiClient.Ship.shipUpkeeps.get(id)}
          saveFn={async (id, data) =>
            horizonApiClient.Ship.shipUpkeeps.insert(id, data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipUpkeeps.delete(id, [resourceId])
          }
        />
      ),
      shipReqTechs: (
        <EntityLevelStuff
          id={id}
          entities={techsList}
          attributeId="techReqId"
          entity={Tables.Techs}
          entityToSave={Tables.ShipReqTechs}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.ShipRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Ship.shipReqTechs.get(id)}
          saveFn={async (id, data) =>
            horizonApiClient.Ship.shipReqTechs.insert(id, data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipReqTechs.delete(id, [resourceId])
          }
        />
      ),
      shipReqBuildings: (
        <EntityLevelStuff
          id={id}
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
          queryFn={() => horizonApiClient.Ship.shipReqBuildings.get(id)}
          saveFn={async (id, data) =>
            horizonApiClient.Ship.shipReqBuildings.insert(id, data)
          }
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipReqBuildings.delete(id, [resourceId])
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
      id={id}
      tabs={tabs}
      content={content}
    />
  );
}

export default ShipForm;
