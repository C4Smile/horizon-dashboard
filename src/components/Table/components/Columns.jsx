import { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// hooks
import { useTableOptions } from "../hooks/TableOptionsProvider";

// models
import { SortOrder } from "../../../models/query/GenericFilter";

export const baseColumns = ["id", "dateOfCreation", "lastUpdate", "deleted"];

const isBaseColumn = (column) => baseColumns.includes(column);

/**
 * Columns component
 * @param {object} props properties for the columns
 * @returns Row of columns
 */
function Columns(props) {
  const { t } = useTranslation();

  const { entity = "", columns = [], columnsOptions = {}, hasAction = true } = props;

  const { onSort, sortingOrder, sortingBy } = useTableOptions();

  const parsedColumns = useMemo(() => {
    const { noSortableColumns = {}, columnClassNames = {} } = columnsOptions;
    return columns.map((key) => ({
      id: key,
      label: t(`_entities:${entity}.${key}.label`),
      className: columnClassNames[key] ?? "",
      sortable: !noSortableColumns[key],
    }));
  }, [columns, columnsOptions, entity, t]);

  return (
    <thead className="text-xs text-gray-700 bg-gray-50">
      <tr>
        {parsedColumns.map((column) => (
          <th key={column.id} scope="col" className={`px-6 py-3 ${column.className}`}>
            <button
              disabled={!column.sortable}
              onClick={() => onSort(column.id)}
              className="flex items-center gap-2"
            >
              <span className="whitespace-nowrap">
                {isBaseColumn(column.id) ? t(`_entities:base.${column.id}`) : column.label}
              </span>
              {column.sortable && (
                <span className={`${sortingBy === column.id ? "opacity-100" : "opacity-0"}`}>
                  {sortingOrder === SortOrder.ASC ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronDown} />
                  )}
                </span>
              )}
            </button>
          </th>
        ))}
        {hasAction && (
          <th scope="col" className="px-6 py-3 text-center">
            {t("_accessibility:labels.actions")}
          </th>
        )}
      </tr>
    </thead>
  );
}

Columns.propTypes = {
  hasAction: PropTypes.bool,
  entity: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.string),
  columnsOptions: PropTypes.shape({
    noSortableColumns: PropTypes.object,
    columnClassNames: PropTypes.object,
  }),
};

export default Columns;
