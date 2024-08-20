import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const baseColumns = ["id", "dateOfCreation", "lastUpdate", "deleted"];

/**
 *
 * @param {string} column - column to evaluate
 * @returns true is the column is a base column
 */
export const isBaseColumn = (column) => baseColumns.includes(column);

/**
 *
 * @param {*} columns - columns to parse
 * @param {*} entity - entity to evaluate
 * @returns parsed columns
 */
export const useParseColumns = (columns, entity) => {
  const { t } = useTranslation();

  const parsedColumns = useMemo(
    () =>
      columns.map((column) => ({
        key: column,
        label: t(`_entities:${isBaseColumn(column) ? "base" : entity}.${column}.label`),
      })),
    [columns, entity, t],
  );

  return { columns: parsedColumns };
};

/**
 * @param {object} parseRows - entity parse rows
 * @returns parsed base columns of row
 */
export const useParseRows = (parseRows) => {
  const { t } = useTranslation();

  const parse = useCallback(
    (row) => {
      const parsedRow = parseRows(row);
      baseColumns.forEach((column) => {
        if (parsedRow[column] !== undefined && parsedRow[column] !== null) {
          switch (column) {
            case "deleted":
              parsedRow[column] = {
                value: row.deleted,
                render: row.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
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
    },
    [parseRows, t],
  );

  return { parse };
};
