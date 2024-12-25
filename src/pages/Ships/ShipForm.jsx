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
import { TabLayout } from "../../components/TabComponent/TabLayout.jsx";
import { EntityLevelStuff } from "../../components/EntityLevelStuff/index.js";

// types
import { shipTabs } from "./types";

// tabs
import { GeneralInfo, ResourceStuff } from "./tabs";

// entity
import { Tech } from "../../models/tech/Tech";
import { Ship } from "../../models/ship/Ship.js";

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
    queryFn: () => horizonApiClient.Ship.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = shipQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [shipQuery]);

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

  //#region ships

  const buildingsQuery = useQuery({
    queryKey: [ReactQueryKeys.Buildings],
    queryFn: () => horizonApiClient.Building.getAll(),
  });

  const buildingsList = useMemo(() => {
    try {
      return (
        buildingsQuery?.data?.items?.map((c) => ({
          value: `${c.name}`,
          id: c.id,
          image: c.image,
        })) ?? []
      );
    } catch (err) {
      return [];
    }
  }, [buildingsQuery?.data?.items]);

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
          entity={Ship.className}
          entityToSave={Ship.costs}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.ShipCosts, id]}
          queryFn={() => horizonApiClient.Ship.shipCosts.get(id)}
          saveFn={async (id, data) => horizonApiClient.Ship.shipCosts.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipCosts.deleteSingle(id, resourceId)
          }
        />
      ),
      upkeep: (
        <ResourceStuff
          id={id}
          resources={resourcesList}
          entity={Ship.className}
          entityToSave={Ship.upkeeps}
          label={"upkeep"}
          inputKey={"baseUpkeep"}
          queryKey={[ReactQueryKeys.ShipUpkeeps, id]}
          queryFn={() => horizonApiClient.Ship.shipUpkeeps.get(id)}
          saveFn={async (id, data) => horizonApiClient.Ship.shipUpkeeps.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipUpkeeps.deleteSingle(id, resourceId)
          }
        />
      ),
      shipReqTechs: (
        <EntityLevelStuff
          id={id}
          entities={techsList}
          attributeId="techReqId"
          entity={Tech.className}
          entityToSave={Ship.techRequirement}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.ShipRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Ship.shipReqTechs.get(id)}
          saveFn={async (id, data) => horizonApiClient.Ship.shipReqTechs.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipReqTechs.deleteSingle(id, resourceId)
          }
        />
      ),
      shipReqBuildings: (
        <EntityLevelStuff
          id={id}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Ship.className}
          entityToSave={Ship.buildRequirement}
          inputKey={"buildingLevel"}
          queryKey={[ReactQueryKeys.ShipRequirements, ReactQueryKeys.Buildings, id]}
          queryFn={() => horizonApiClient.Ship.shipReqBuildings.get(id)}
          saveFn={async (id, data) => horizonApiClient.Ship.shipReqBuildings.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Ship.shipReqBuildings.deleteSingle(id, resourceId)
          }
        />
      ),
    }),
    [shipQuery, id, resourcesList, techsList, buildingsList, horizonApiClient],
  );

  return notFound ? (
    <NotFound />
  ) : (
    <TabLayout
      name={shipQuery?.data?.name}
      entity={ReactQueryKeys.Ships}
      id={id}
      tabs={tabs}
      content={content}
    />
  );
}

export default ShipForm;
