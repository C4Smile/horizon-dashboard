import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// tippy
import Tippy from "@tippyjs/react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// components
import Loading from "../../partials/loading/Loading";

// models
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { queryClient } from "../../providers/MuseumApiProvider";

const baseColumns = ["id", "dateOfCreation", "lastUpdate", "deleted"];

const isBaseColumn = (column) => baseColumns.includes(column);

/**
 * Table component
 * @param {object} props - component props
 * @returns Table component
 */
function Table(props) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();

  const { parent, columns, rows, isLoading, actions, apiClient, queryKey, onSort } = props;

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

  const getActions = useMemo(() => {
    return [
      ...actions,
      {
        id: "edit",
        onClick: (e) => navigate(`/${parent}/${queryKey}/${e.id}`),
        icon: faPencil,
        tooltip: t("_accessibility:buttons.edit"),
      },
      {
        id: "delete",
        hidden: (entity) => entity.deleted.value,
        onClick: async (e) => {
          const result = await apiClient.delete([e.id]);
          const { error, status, data } = result;
          if (data?.count) {
            setNotification("deleted", { count: data.count });
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          } else {
            // eslint-disable-next-line no-console
            console.error(error);
            setNotification(String(status));
          }
        },
        icon: faTrash,
        tooltip: t("_accessibility:buttons.delete"),
      },
      {
        id: "restore",
        hidden: (entity) => !entity.deleted.value,
        onClick: async (e) => {
          const result = await apiClient.restore([e.id]);
          const { error, status, data } = result;
          if (data?.count) {
            setNotification("restored", { count: data.count });
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          } else {
            // eslint-disable-next-line no-console
            console.error(error);
            setNotification(String(status));
          }
        },
        icon: faArrowRotateLeft,
        tooltip: t("_accessibility:buttons.restore"),
      },
    ];
  }, [actions, apiClient, navigate, queryKey, setNotification, t]);

  const parsedRows = useMemo(
    () =>
      rows.map((row) => {
        const parsedRow = { ...row };
        baseColumns.forEach((column) => {
          if (parsedRow[column] !== undefined && parsedRow[column] !== null) {
            switch (column) {
              case "deleted":
                parsedRow[column] = {
                  value: row.deleted,
                  render: row.deleted
                    ? t("_accessibility:buttons.yes")
                    : t("_accessibility:buttons.no"),
                };
                break;
              case "dateOfCreation":
                parsedRow[column] = {
                  value: row.dateOfCreation,
                  render: new Date(row.dateOfCreation).toLocaleDateString("es-ES"),
                };
                break;
              case "lastUpdate":
                parsedRow[column] = {
                  value: row.lastUpdate,
                  render: new Date(row.lastUpdate).toLocaleDateString("es-ES"),
                };
                break;
              default:
                break;
            }
          }
        });
        return parsedRow;
      }),
    [rows, t],
  );

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
            {Boolean(getActions.length) && (
              <th scope="col" className="px-6 py-3 text-center">
                {t("_accessibility:labels.actions")}
              </th>
            )}
          </tr>
        </thead>
        {!isLoading && Boolean(rows.length) && (
          <tbody>
            {parsedRows.map((row) => (
              <tr
                key={row.id}
                className={`border-b ${row.deleted.value ? "bg-secondary/10" : "bg-white"}`}
              >
                {columns.map((column, i) => (
                  <td
                    key={column.id}
                    className={`px-6 py-4 font-medium ${i === 0 ? "text-gray-900 whitespace-nowrap" : ""} ${column.className}`}
                  >
                    {row[column.id]?.render ?? row[column.id]}
                  </td>
                ))}
                {Boolean(getActions.length) && (
                  <td>
                    <div className="flex items-center gap-3 w-full justify-center">
                      {getActions
                        .filter((action) => !action.hidden || !action.hidden(row))
                        .map((action) => (
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
