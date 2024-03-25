import React from "react";
import PropTypes from "prop-types";

// components
import Loading from "../../partials/loading/Loading";

/**
 * Table component
 * @param {object} props - component props
 * @returns Table component
 */
function Table(props) {
  const { columns, rows, isLoading, actions } = props;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={`px-6 py-3 ${column.className}`}>
                {column.label}
              </th>
            ))}
            {Boolean(actions.length) && <th scope="col" className="px-6 py-3"></th>}
          </tr>
        </thead>
        {!isLoading && Boolean(rows.length) && (
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {columns.map((column, i) => (
                  <td
                    key={column.id}
                    scope="row"
                    className={`px-6 py-4 font-medium ${i === 0 ? "text-gray-900 whitespace-nowrap dark:text-white" : ""} `}
                  >
                    {row[column.id]}
                  </td>
                ))}
                {Boolean(actions.length) && <td>{actions.map((action) =>  )}</td>}
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
};

Table.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  actions: PropTypes.array,
};

export default Table;
