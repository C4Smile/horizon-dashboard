import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// dto
import { Skill } from "../../models/skill/Skill";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";
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
 * Skill page
 * @returns Skill page component
 */
function SkillPage() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Skill, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => horizonApiClient.Skill.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (skill) => {
    return {
      ...skill,
      name: (
        <Link className="underline text-light-primary flex" to={`${skill.id}`}>
          <span className="truncate">{skill.name}</span>
        </Link>
      ),
      imageId: skill.image?.url ? (
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

  const getActions = useActions({
    apiClient: horizonApiClient.Skill,
    queryKey: ReactQueryKeys.Skills,
    parent: Parents.game,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Skill(), ["id", "dateOfCreation", "deleted", "content"]),
    Skill.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
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
  );
}

export default SkillPage;