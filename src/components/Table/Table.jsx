import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// tippy
import Tippy from "@tippyjs/react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import Loading from "../../partials/loading/Loading";

// table components
import Columns, { baseColumns } from "./components/Columns";
import Navigation from "./components/Navigation";
import PageSize from "./components/PageSize";
import Filters from "./components/Filters";
import Empty from "./components/Empty";

/**
 * Table component
 * @param {object} props - component props
 * @returns Table component
 */
function Table(props) {
  const { t } = useTranslation();

  const {
    title,
    rows,
    parseRows,
    entity = "",
    isLoading = false,
    actions = [],
    columns = [],
    columnsOptions = {},
  } = props;

  const parsedRows = useMemo(
    () =>
      rows?.map((row) => {
        const parsedRow = parseRows(row);
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
      }) ?? [],
    [parseRows, rows, t],
  );

  return (
    <div className="relative overflow-x-auto w-full h-full">
      <div className="mb-5 flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {rows?.length && !isLoading && <PageSize />}
        </div>
        <div className="flex gap-5 items-center justify-end">
          <Filters filters={[]} />
        </div>
      </div>

      <div className="h-[calc(100vh-280px)] overflow-auto">
        {!rows?.length && !isLoading ? (
          <Empty />
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <Columns
              entity={entity}
              columns={columns}
              columnsOptions={columnsOptions}
              hasAction={actions?.length > 0}
            />
            {!isLoading && Boolean(rows?.length) && (
              <tbody>
                {parsedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b ${row.deleted.value ? "bg-secondary/10" : "bg-white"}`}
                  >
                    {columns.map((column, i) => (
                      <td
                        key={column}
                        className={`px-6 py-4 font-medium ${i === 0 ? "text-gray-900 whitespace-nowrap" : ""} ${column.className}`}
                      >
                        {row[column]?.render ?? row[column]}
                      </td>
                    ))}
                    {Boolean(actions.length) && (
                      <td>
                        <div className="flex items-center gap-3 w-full justify-center">
                          {actions
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
        )}
      </div>
      {isLoading && <Loading className="bg-white top-0 left-0 w-full h-full" />}
      {!isLoading && rows?.length && <Navigation />}
    </div>
  );
}

Table.propTypes = {
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  actions: PropTypes.array,
  entity: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.string),
  columnsOptions: PropTypes.shape({
    noSortableColumns: PropTypes.object,
    columnClassNames: PropTypes.object,
  }),
  rows: PropTypes.array,
  parseRows: PropTypes.func,
};

export default Table;
