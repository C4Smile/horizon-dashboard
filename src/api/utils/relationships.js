/**
 * Parse a one-to-many relationship
 * @param {string} remoteAttribute - Remote attribute to compare
 * @param {object[]} localList - Local list
 * @param {object[]} remoteList - Remote list
 * @returns {object[]} List of elements to add or remove
 */
export const parseManyToMany = (remoteAttribute, localList = [], remoteList = []) => {
  const toAdd = [];
  const toRemove = [];

  const getToCompare = (element) =>
    element[remoteAttribute]?.id ?? element[remoteAttribute] ?? element.id;

  // adding new elements
  if (localList)
    for (const localElement of localList) {
      if (!remoteList) {
        // create new element
        const elToAdd = { delete: false, ...localElement };
        elToAdd[remoteAttribute] = getToCompare(localElement);
        // add to list
        toAdd.push(elToAdd);
        continue;
      }
      const remoteTag = remoteList.find(
        (element) => getToCompare(element) === getToCompare(localElement),
      );
      if (!remoteTag) {
        // create new element
        const elToAdd = { delete: false, ...localElement };
        elToAdd[remoteAttribute] = getToCompare(localElement);
        // add to list
        toAdd.push(elToAdd);
      }
    }
  // removing elements
  if (remoteList)
    for (const remoteElement of remoteList) {
      if (!localList) {
        // create new element
        const elToRemove = { delete: true, ...remoteElement };
        elToRemove[remoteAttribute] = getToCompare(remoteElement);
        // add to list
        toRemove.push(elToRemove);

        continue;
      }
      const localElement = localList.find(
        (element) => getToCompare(element) === getToCompare(remoteElement),
      );
      if (!localElement) {
        // create new element
        const elToRemove = { delete: true, ...remoteElement };
        elToRemove[remoteAttribute] = getToCompare(remoteElement);
        // add to list
        toRemove.push(elToRemove);
      }
    }
  return [...toAdd, ...toRemove];
};
