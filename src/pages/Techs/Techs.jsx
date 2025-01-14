import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table } from "@sito/dashboard";

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
import { ReactQueryKeys } from "../../utils/queryKeys";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";

// sitemap
import { findPath, pageId } from "../sitemap";
import { useHorizonQuery } from "../../hooks/query/useHorizonQuery.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
};

/**
 * Tech page
 * @returns Tech page component
 */
function TechPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading } = useHorizonQuery({
    entity: ReactQueryKeys.Techs,
    queryFn: (data) => horizonApiClient.Tech.getAll(data),
  });

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
          to={`${findPath(pageId.techTypesEdit)}/${tech.type?.id}`}
        >
          <span className="truncate">{tech?.type?.name}</span>
        </Link>
      ),
      creationTime: {
        value: tech.creationTime,
        render: `${tech.creationTime} ${t("_accessibility:labels.days")}`,
      },
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

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.Techs,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Techs,
    apiClient: horizonApiClient.Tech,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Techs,
    apiClient: horizonApiClient.Tech,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

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
