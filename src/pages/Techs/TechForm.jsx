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
import { techTabs } from "./types";

// tabs
import { GeneralInfo, ResourceStuff } from "./tabs";

// entity
import { Tech } from "../../models/tech/Tech";
import { Building } from "../../models/building/Building";

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
      techTabs
        .filter((tab) => (tab.hide ? tab.hide(!!id) : true))
        .map(({ id }) => ({
          id,
          label: t(`_pages:techs.tabs.${id}`),
        })),
    [id, t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo techQuery={techQuery} />,
      produces: (
        <ResourceStuff
          id={id}
          resources={resourcesList}
          entity={Tech.className}
          entityToSave={Tech.resourceUpgrade}
          label={"production"}
          inputKey={"baseProduction"}
          queryKey={[ReactQueryKeys.TechProduces, id]}
          queryFn={() => horizonApiClient.Tech.techProductions.get(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.techProductions.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Tech.techProductions.deleteSingle(id, resourceId)
          }
        />
      ),
      costs: (
        <ResourceStuff
          id={id}
          resources={resourcesList}
          entity={Tech.className}
          entityToSave={Tech.costs}
          label={"cost"}
          inputKey={"baseCost"}
          queryKey={[ReactQueryKeys.TechCosts, id]}
          queryFn={() => horizonApiClient.Tech.techCosts.get(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.techCosts.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Tech.techCosts.deleteSingle(id, resourceId)
          }
        />
      ),
      techReqTechs: (
        <EntityLevelStuff
          id={id}
          entities={techsList}
          attributeId="techReqId"
          entity={Tech.className}
          entityToSave={Tech.techRequirement}
          label={"req"}
          inputKey={"techLevel"}
          queryKey={[ReactQueryKeys.TechRequirements, ReactQueryKeys.Techs, id]}
          queryFn={() => horizonApiClient.Tech.techReqTechs.get(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.techReqTechs.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Tech.techReqTechs.deleteSingle(id, resourceId)
          }
        />
      ),
      techReqBuildings: (
        <EntityLevelStuff
          id={id}
          entities={buildingsList}
          attributeId="buildingReqId"
          entity={Building.className}
          entityToSave={Tech.buildingRequirement}
          inputKey={"buildingLevel"}
          queryKey={[ReactQueryKeys.TechRequirements, ReactQueryKeys.Buildings, id]}
          queryFn={() => horizonApiClient.Tech.techReqBuildings.get(id)}
          saveFn={async (id, data) => horizonApiClient.Tech.techReqBuildings.save(id, data)}
          deleteFn={async (id, resourceId) =>
            horizonApiClient.Tech.techReqBuildings.deleteSingle(id, resourceId)
          }
        />
      ),
    }),
    [buildingsList, horizonApiClient, id, resourcesList, techQuery, techsList],
  );

  return notFound ? (
    <NotFound />
  ) : (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {id ? `${t("_pages:techs.editForm")} ${id}` : t("_pages:techs.newForm")}
      </h1>
      <TabComponent tabs={tabs} content={content} />
    </>
  );
}

export default TechForm;
