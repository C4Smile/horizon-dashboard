import config from "../config";
class PhotoReducerActionType {
  type = "";
}

/**
 * Photo array reducer
 * @param {object[]} state - photo array
 * @param {PhotoReducerActionType} action - action
 * @returns {object[]} new state
 */
export function localPhotoReducer(state, action) {
  const { type } = action;
  switch (type) {
    case "set": {
      const { items } = action;
      return items;
    }
    case "add": {
      const { item, items } = action;
      if (item) return [...state, item];
      else if (items) return [...state, ...items];
      return state;
    }
    case "delete": {
      const { index } = action;
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    }
    default:
      return state;
  }
}

/**
 *
 * @param {string} string - string
 * @returns {string} static url photo
 */
export const staticUrlPhoto = (string) => `${config.apiUrl}public/images/${string}`;

/**
 *
 * @param {string} str string to parse
 * @returns camelized string
 */
export function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
