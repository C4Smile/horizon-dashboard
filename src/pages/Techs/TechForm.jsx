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
import { techTabs } from "./types";

// tabs
import GeneralInfo from "./Tabs/GeneralInfo";
import Produces from "./Tabs/Produces";
import Costs from "./Tabs/Costs";
import TechRequirements from "./Tabs/TechRequirements";

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

  const tabs = useMemo(
    () => techTabs.map((tab) => ({ id: tab, label: t(`_pages:techs.tabs.${tab}`) })),
    [t],
  );

  const content = useMemo(
    () => ({
      general: <GeneralInfo techQuery={techQuery} />,
      produces: <Produces id={id} />,
      costs: <Costs id={id} />,
      techRequirements: <TechRequirements id={id} />,
    }),
    [id, techQuery],
  );

  return notFound ? <NotFound /> : <TabComponent tabs={tabs} content={content} />;
}

export default TechForm;
