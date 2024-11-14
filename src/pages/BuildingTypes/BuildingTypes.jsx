import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { BuildingType } from "../../models/buildingType/BuildingType";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
};

/**
 * BuildingType page
 * @returns BuildingType page component
 */
function BuildingTypePage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.BuildingTypes, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.BuildingType.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (buildingType) => {
    return {
      ...buildingType,
      name: (
        <Link className="underline text-light-primary flex" to={`${buildingType.id}`}>
          <span className="truncate">{buildingType.name}</span>
        </Link>
      ),
      imageId: buildingType.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(buildingType.image.url)}
          alt={`${buildingType.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={buildingType.name} />
      ),
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.BuildingType,
    queryKey: ReactQueryKeys.BuildingTypes,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new BuildingType(), ["id", "dateOfCreation", "deleted", "content"]),
    BuildingType.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={BuildingType.className}
      columns={columns}
      columnsOptions={{ columnClasses, noSortableColumns }}
      title={t("_pages:game.links.buildingTypes")}
    />
  );
}

export default BuildingTypePage;
