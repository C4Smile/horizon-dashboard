import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { Activity } from "../../models/activity/Activity";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys, parents } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";
import { useTableOptions } from "../../components/Table/hooks/TableOptionsProvider";

// components
import Table from "../../components/Table/Table";

// utils
import { staticUrlPhoto } from "../../components/utils";

// hooks
import { useActions } from "../../components/Table/hooks/useActions";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
  entity: true,
};

/**
 * Activities page
 * @returns Activities page component
 */
function ActivitiesPage() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Activities, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.Activity.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  const prepareRows = (activity) => {
    let parsedAction = "-";
    const sAction = activity?.entity?.split(",");

    if (sAction?.length === 2)
      parsedAction = (
        <Link
          className="underline text-light-primary flex"
          to={`/${parents[sAction[0]]}/${sAction[0]}s/${sAction[1]}`}
        >
          <span className="truncate capitalize">{`${sAction[0]} - ${sAction[1]}`}</span>
        </Link>
      );
    return {
      ...activity,
      title: (
        <Link className="underline text-light-primary flex" to={`${activity.id}`}>
          <span className="truncate">{activity.title}</span>
        </Link>
      ),
      imageId: activity.imageId?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(activity.imageId.url)}
          alt={`${activity.title}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={activity.title} />
      ),
      entity: parsedAction,
    };
  };

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const getActions = useActions({
    apiClient: museumApiClient.Activity,
    queryKey: ReactQueryKeys.Activities,
    parent: "information",
  });

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={prepareRows}
      entity={Activity.className}
      columns={extractKeysFromObject(new Activity(), ["id", "description", "dateOfCreation"])}
      columnsOptions={{ columnClasses, noSortableColumns }}
      title={t("_pages:information.links.activities")}
    />
  );
}

export default ActivitiesPage;
