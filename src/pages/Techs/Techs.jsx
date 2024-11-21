import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// components
import { staticUrlPhoto } from "../../components/utils";
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// dto
import { Tech } from "../../models/tech/Tech";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";

// sitemap
import { findPath, pageId } from "../sitemap";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  imageId: true,
};

/**
 * Tech page
 * @returns Tech page component
 */
function TechPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Techs, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Tech.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (tech) => {
    return {
      ...tech,
      name: (
        <Link className="underline text-light-primary flex" to={`${tech.id}`}>
          <span className="truncate">{tech.name}</span>
        </Link>
      ),
      type: (
        <Link
          className="underline text-light-primary flex"
          to={`${findPath(pageId.techTypesEdit)}/${tech.typeId}`}
        >
          <span className="truncate">{tech?.type?.name}</span>
        </Link>
      ),
      image: tech.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(tech.image.url)}
          alt={`${tech.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={tech.name} />
      ),
    };
  };

  const getActions = useActions({
    apiClient: horizonApiClient.Tech,
    queryKey: ReactQueryKeys.Techs,
    parent: Parents.game,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Tech(), ["id", "dateOfCreation", "deleted", "description", "urlName"]),
    Tech.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={Tech.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.techs")}
      />
      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default TechPage;
