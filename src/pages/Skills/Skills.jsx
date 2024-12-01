import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// dto
import { Skill } from "../../models/skill/Skill";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { staticUrlPhoto } from "../../components/utils";

// components
import { FloatingButton } from "../../components/FloatingButton/FloatingButton.jsx";

// providers
import { useHorizonApiClient } from "../../providers/HorizonApiProvider";

// hooks
import { useRestoreAction, useDeleteAction, useEditAction } from "../../hooks";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns.jsx";
import { useHorizonQuery } from "../../hooks/query/useHorizonQuery.jsx";

const columnClasses = {
  lastUpdate: "w-56",
};

const noSortableColumns = {
  image: true,
};

/**
 * Skill page
 * @returns Skill page component
 */
function SkillPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { data, isLoading } = useHorizonQuery({
    entity: ReactQueryKeys.Skills,
    queryFn: (data) => horizonApiClient.Skill.getAll(data),
  });

  const prepareRows = (skill) => {
    return {
      ...skill,
      name: (
        <Link className="underline text-light-primary flex" to={`${skill.id}`}>
          <span className="truncate">{skill.name}</span>
        </Link>
      ),
      image: skill.image?.url ? (
        <img
          className={`w-10 h-10 rounded-full object-cover border-white border-2`}
          src={staticUrlPhoto(skill.image.url)}
          alt={`${skill.name}`}
        />
      ) : (
        <img className="w-10 h-10 rounded-full object-cover" src={noProduct} alt={skill.name} />
      ),
    };
  };

  //#region Actions

  const editAction = useEditAction({
    entity: ReactQueryKeys.Skills,
  });

  const restoreAction = useRestoreAction({
    entity: ReactQueryKeys.Skills,
    apiClient: horizonApiClient.Skill,
  });

  const deleteAction = useDeleteAction({
    entity: ReactQueryKeys.Skills,
    apiClient: horizonApiClient.Skill,
  });

  const getActions = useCallback(
    (row) => [editAction.action(row), restoreAction.action(row), deleteAction.action(row)],
    [deleteAction, editAction, restoreAction],
  );

  //#endregion Actions

  const { columns } = useParseColumns(
    extractKeysFromObject(new Skill(), ["id", "dateOfCreation", "deleted", "description", "urlName"]),
    Skill.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <>
      <Table
        rows={data?.items}
        actions={getActions}
        isLoading={isLoading}
        parseRows={rows}
        entity={Skill.className}
        columns={columns}
        columnsOptions={{ columnClasses, noSortableColumns }}
        title={t("_pages:game.links.skills")}
      />
      <FloatingButton component="link" href="new" icon={faAdd} />
    </>
  );
}

export default SkillPage;
