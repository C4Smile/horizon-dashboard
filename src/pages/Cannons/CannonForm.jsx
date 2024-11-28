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
import { cannonTabs } from "./types";

// tabs
import { GeneralInfo, ResourceStuff } from "./tabs";

// entity
import { Tech } from "../../models/tech/Tech";
import { Cannon } from "../../models/cannon/Cannon.js";

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
    queryFn: () => horizonApiClient.Cannon.getById(id),
    enabled: id !== undefined,
  });

  useEffect(() => {
    const { data } = cannonQuery;
    // eslint-disable-next-line no-console
    if (data && data.error) console.error(data.error.message);
    if (data?.status === 404) setNotFound(true);
  }, [cannonQuery]);

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

  //#region cannons

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
          id={id}
          resources={resourcesList}
          entity={Cannon.className}
          entityToSave={Cannon.costs}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.CannonCosts, id]}
          queryFn={() => horizonApiClient.Cannon.cannonCosts.get(id)}
          saveFn={async (id, data) => horizonApiClient.Cannon.cannonCosts.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Cannon.cannonCosts.deleteSingle(id, resourceId)
          }
        />
      ),
      cannonReqTechs: (
        <EntityLevelStuff
          id={id}
          entities={techsList}
          attributeId="techReqId"
          entity={Tech.className}
          entityToSave={Cannon.techRequirement}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.CannonRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Cannon.cannonReqTechs.get(id)}
          saveFn={async (id, data) => horizonApiClient.Cannon.cannonReqTechs.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Cannon.cannonReqTechs.deleteSingle(id, resourceId)
          }
        />
      ),
      cannonReqBuildings: (
        <EntityLevelStuff
          id={id}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Cannon.className}
          entityToSave={Cannon.buildingRequirement}
          inputKey={"buildingLevel"}
          queryKey={[ReactQueryKeys.CannonRequirements, ReactQueryKeys.Buildings, id]}
          queryFn={() => horizonApiClient.Cannon.cannonReqBuildings.get(id)}
          saveFn={async (id, data) => horizonApiClient.Cannon.cannonReqBuildings.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Cannon.cannonReqBuildings.deleteSingle(id, resourceId)
          }
        />
      ),
    }),
    [cannonQuery, id, resourcesList, techsList, buildingsList, horizonApiClient],
  );

  return notFound ? (
    <NotFound />
  ) : (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {id
          ? `${t("_pages:cannons.editForm")} ${cannonQuery?.data?.name}`
          : t("_pages:cannons.newForm")}
      </h1>
      <TabComponent tabs={tabs} content={content} />
    </>
  );
}

export default CannonForm;
