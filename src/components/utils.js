// eslint-disable-next-line no-unused-vars
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
