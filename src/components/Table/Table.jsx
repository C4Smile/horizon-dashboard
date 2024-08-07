import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import Loading from "../../partials/loading/Loading";

// models
import { SortOrder } from "../../models/query/GenericFilter";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const baseColumns = ["id", "dateOfCreation", "lastUpdate", "deleted"];

const isBaseColumn = (column) => baseColumns.includes(column);

/**
 * Table component
 * @param {object} props - component props
 * @returns Table component
 */
function Table(props) {
  const { t } = useTranslation();

  const { columns, rows, isLoading, actions, onSort } = props;

  const [sortingBy, setSortingBy] = useState("dateOfCreation");
  const [sortingOrder, setSortingOrder] = useState(SortOrder.ASC);

  const localOnSort = (attribute) => {
    let localSortingOrder = sortingOrder;
    if (sortingBy === attribute)
      switch (sortingOrder) {
        case SortOrder.ASC:
          localSortingOrder = SortOrder.DESC;
          break;
        default:
          localSortingOrder = SortOrder.ASC;
          break;
      }
    setSortingBy(attribute);
    setSortingOrder(localSortingOrder);
    if (onSort) onSort(attribute, localSortingOrder);
  };

  return (
    <div className="relative overflow-x-auto w-full h-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={`px-6 py-3 ${column.className}`}>
                <button
                  disabled={!column.sortable}
                  onClick={() => localOnSort(column.id)}
                  className="flex items-center gap-2"
                >
                  {isBaseColumn(column.id) ? t(`_entities:base.${column.id}`) : column.label}
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
            {Boolean(actions.length) && (
              <th scope="col" className="px-6 py-3 text-center">
                {t("_accessibility:labels.actions")}
              </th>
            )}
          </tr>
        </thead>
        {!isLoading && Boolean(rows.length) && (
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`bg-white border-b ${row.deleted.value ? "bg-secondary/10" : ""}`}
              >
                {columns.map((column, i) => (
                  <td
                    key={column.id}
                    className={`px-6 py-4 font-medium ${i === 0 ? "text-gray-900 whitespace-nowrap" : ""} ${column.className}`}
                  >
                    {row[column.id]?.render ?? row[column.id]}
                  </td>
                ))}
                {Boolean(actions.length) && (
                  <td>
                    <div className="flex items-center gap-3 w-full justify-center">
                      {actions.map((action) => (
                        <Tippy key={action.id} content={action.tooltip}>
                          <button onClick={() => action.onClick(row)}>
                            <FontAwesomeIcon icon={action.icon} />
                          </button>
                        </Tippy>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {!rows.length && !isLoading && (
        <div className="bg-gray-50 w-full flex items-center justify-center py-2 border-t-[1px]">
          <p>No data</p>
        </div>
      )}
      {isLoading && <Loading className="bg-white top-0 left-0 w-full h-full" />}
    </div>
  );
}

Table.defaultProps = {
  columns: [],
  rows: [],
  isLoading: true,
  actions: [],
  onSort: (attribute) => attribute,
};

Table.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  actions: PropTypes.array,
  onSort: PropTypes.func,
};

export default Table;
