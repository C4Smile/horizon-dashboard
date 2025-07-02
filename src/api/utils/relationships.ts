import { BaseEntityDto } from "lib";

/**
 * Parse a one-to-many relationship
 * @param remoteAttribute - Remote attribute to compare
 * @param localList - Local list
 * @param remoteList - Remote list
 * @returns List of elements to add or remove
 */
export const parseManyToMany = <T extends BaseEntityDto>(
  remoteAttribute: keyof T,
  localList: T[] = [],
  remoteList: T[] = [],
  hasId: boolean = true
) => {
  const toAdd = [];
  const toRemove = [];

  const getToCompare = (element: T, hasId: boolean) =>
    hasId ? element[remoteAttribute] : element.id;

  // adding new elements
  if (localList)
    for (const localElement of localList) {
      if (!remoteList) {
        // create new element
        const elToAdd = { delete: false, ...localElement } as T;
        elToAdd[remoteAttribute] = getToCompare(
          localElement,
          hasId
        ) as T[keyof T];
        // add to list
        toAdd.push(elToAdd);
        continue;
      }
      const remoteTag = remoteList.find(
        (element) =>
          getToCompare(element, hasId) === getToCompare(localElement, hasId)
      );
      if (!remoteTag) {
        // create new element
        const elToAdd = { delete: false, ...localElement } as T;
        elToAdd[remoteAttribute] = getToCompare(
          localElement,
          hasId
        ) as T[keyof T];
        // add to list
        toAdd.push(elToAdd);
      }
    }
  // removing elements
  if (remoteList)
    for (const remoteElement of remoteList) {
      if (!localList) {
        // create new element
        const elToRemove = { delete: true, ...remoteElement } as T;
        elToRemove[remoteAttribute] = getToCompare(
          remoteElement,
          hasId
        ) as T[keyof T];
        // add to list
        toRemove.push(elToRemove);

        continue;
      }
      const localElement = localList.find(
        (element) =>
          getToCompare(element, hasId) === getToCompare(remoteElement, hasId)
      );
      if (!localElement) {
        // create new element
        const elToRemove = { delete: true, ...remoteElement } as T;
        elToRemove[remoteAttribute] = getToCompare(
          remoteElement,
          hasId
        ) as T[keyof T];
        // add to list
        toRemove.push(elToRemove);
      }
    }
  return [...toAdd, ...toRemove];
};
