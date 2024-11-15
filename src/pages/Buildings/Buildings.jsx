import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { Building } from "../../models/building/Building";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";
import { findPath, pageId } from "../sitemap.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
  costs: true,
  produces: true,
  upkeeps: true,
  techRequirements: true,
};

/**
 * Building page
 * @returns Building page component
 */
function BuildingPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Buildings, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Building.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (building) => {
    return {
      ...building,
      title: (
        <Link className="underline text-light-primary flex" to={`${building.id}`}>
          <span className="truncate">{building.title}</span>
        </Link>
      ),
      typeId: (
        <Link
          className="underline text-light-primary flex"
          to={`${findPath(pageId.buildingTypesEdit)}/${building.typeId}`}
        >
          <span className="truncate">{building?.type?.name}</span>
        </Link>
      ),
      imageId: building.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(building.image.url)}
          alt={`${building.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={building.name} />
      ),
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.Building,
    queryKey: ReactQueryKeys.Buildings,
    parent: Parents.game,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Building(), [
      "id",
      "dateOfCreation",
      "deleted",
      "description",
      "urlName",
    ]),
    Building.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={Building.className}
      columns={columns}
      columnsOptions={{ columnClasses, noSortableColumns }}
      title={t("_pages:game.links.buildings")}
    />
  );
}

export default BuildingPage;
