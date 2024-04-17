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
    onSort(attribute, localSortingOrder);
  };

  return (
    <div className="relative overflow-x-auto w-full h-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={`px-6 py-3 ${column.className}`}>
                <button onClick={() => localOnSort(column.id)} className="flex items-center gap-2">
                  {column.label}

                  <span className={`${sortingBy === column.id ? "opacity-100" : "opacity-0"}`}>
                    {sortingOrder === SortOrder.ASC ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )}
                  </span>
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
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {columns.map((column, i) => (
                  <td
                    key={column.id}
                    className={`px-6 py-4 font-medium ${i === 0 ? "text-gray-900 whitespace-nowrap dark:text-white" : ""} `}
                  >
                    {row[column.id]}
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
        <div className="bg-gray-50 dark:bg-gray-700 w-full flex items-center justify-center py-2 border-t-[1px]">
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
