/**
 * Input State Class Name
 * @param {string} state - input state
 * @returns input class name by
 */
export const inputStateClassName = (state) => {
  switch (state) {
    case "error":
      return "border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500";
    case "good":
      return "border-green-500 text-green-900 placeholder-green-700 focus:ring-green-500 focus:border-green-500";
    default:
      return "text-gray-900 border-gray-300 focus:border-blue-600";
  }
};

/**
 * Label State Class Name
 * @param {string} state - input state
 * @returns input class name by
 */
export const labelStateClassName = (state) => {
  switch (state) {
    case "error":
      return "peer-focus:text-red-700 text-red-700";
    case "good":
      return "peer-focus:text-green-700 text-green-700";
    default:
      return "peer-focus:text-blue-600 text-gray-500";
  }
};

/**
 * Helper Text State Class Name
 * @param {string} state - input state
 * @returns input class name by
 */
export const helperTextStateClassName = (state) => {
  switch (state) {
    case "error":
      return "text-red-600";
    case "good":
      return "text-green-600";
    default:
      return "text-gray-500";
  }
};
