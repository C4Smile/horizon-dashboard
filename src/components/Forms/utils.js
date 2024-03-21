/**
 * Input State Class Name
 * @param {string} state
 * @returns input class name by
 */
export const inputStateClassName = (state) => {
  switch (state) {
    case "error":
      return "border-red-500 text-red-900 dark:text-red-500 placeholder-red-700 dark:placeholder-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500";
    case "good":
      return "border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 dark:border-green-500 focus:ring-green-500 focus:border-green-500";
    default:
      return "text-gray-900 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-600";
  }
};

/**
 * Label State Class Name
 * @param {string} state
 * @returns input class name by
 */
export const labelStateClassName = (state) => {
  switch (state) {
    case "error":
      return "peer-focus:text-red-700 peer-focus:dark:text-red-500 text-red-700 dark:text-red-500";
    case "good":
      return "peer-focus:text-green-700 peer-focus:dark:text-green-500 text-green-700 dark:text-green-500";
    default:
      return "peer-focus:text-blue-600 peer-focus:dark:text-blue-500 text-gray-500 dark:text-gray-400";
  }
};

/**
 * Helper Text State Class Name
 * @param {string} state
 * @returns input class name by
 */
export const helperTextStateClassName = (state) => {
  switch (state) {
    case "error":
      return "text-red-600 dark:text-red-500";
    case "good":
      return "text-green-600 dark:text-green-500";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
};
