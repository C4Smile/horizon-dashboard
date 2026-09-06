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

/** What the api will resize a picture to on the way out. */
export type PhotoSize = {
  /** width in pixels; ask for twice what the css box is, for dense screens */
  w?: number;
  h?: number;
  /** 1 to 100, 82 unless said otherwise */
  q?: number;
  fit?: "cover" | "contain" | "inside";
  f?: "webp" | "avif" | "jpeg" | "png";
};

/**
 * The art is stored at over a thousand pixels a side and most of the screens
 * that show it draw it small. Passing a size makes the api render it once and
 * serve that instead: a table thumbnail goes from some 290 kB to about one.
 *
 * @param string - path of the picture inside public/images
 * @param size - what to ask the api for; the original when left out
 * @returns static url photo
 */
export const staticUrlPhoto = (string: string, size?: PhotoSize) => {
  const url = `${config.apiUrl}public/images/${string}`;
  if (!size) return url;

  const query = Object.entries(size)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");

  return query.length ? `${url}?${query}` : url;
};

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
