import { BlobDto } from "lib";
import config from "../../config";

export type PhotoReducerActionType = {
  type: "set" | "add" | "delete";
  key?: string;
  item?: BlobDto;
  items?: BlobDto[];
  index?: number;
};

/**
 * Photo array reducer
 * @param state - photo array
 * @param action - action
 * @returns new state
 */
export function localPhotoReducer(
  state: BlobDto[],
  action: PhotoReducerActionType,
) {
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
      newState.splice(index ?? 0, 1);
      return newState;
    }
    default:
      return state;
  }
}

/**
 *
 * @param string - string
 * @returns static url photo
 */
export const staticUrlPhoto = (string: string) =>
  `${config.apiUrl}public/images/${string}`;

/**
 *
 * @param str string to parse
 * @returns caramelized string
 */
export function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
