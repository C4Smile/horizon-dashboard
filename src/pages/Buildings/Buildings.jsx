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

// components
import Chip from "../../components/Chip/Chip";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  buildingHasTag: true,
  buildingHasImage: true,
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
    queryKey: [ReactQueryKeys.Building, sortingBy, sortingOrder, currentPage, pageSize],
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
      buildingHasTag:
        (
          <div className="flex flex-wrap gap-3">
            {building.buildingHasTag?.map(({ tagId: tag }) => (
              <Chip key={tag?.id} label={tag?.name} spanClassName="text-xs" />
            ))}
          </div>
        ) ?? " - ",
      buildingHasImage:
        building.buildingHasImage && building.buildingHasImage.length ? (
          <div className="flex items-center justify-start">
            {building.buildingHasImage.map((image, i) => (
              <img
                key={i}
                className={`small-image rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                src={staticUrlPhoto(image.imageId.url)}
                alt={`${building.title} ${i}`}
              />
            ))}
          </div>
        ) : (
          <img className="small-image rounded-full object-cover" src={noProduct} alt={building.title} />
        ),
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.Building,
    queryKey: ReactQueryKeys.Building,
    parent: Parents.building,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Building(), ["id", "dateOfCreation", "deleted", "content"]),
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
