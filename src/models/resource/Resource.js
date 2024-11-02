import { Entity } from "../entity/Entity";

/**
 * @class Resource
 * @description Represents a resource
 */
export class Resource extends Entity {
  name = "";
  imageId = 0;
  baseFactor = 0;

  static className = "resource";

  /**
   * @param {number} id - Resource id
   * @param {string} name - Resource name
   * @param {number} baseFactor - Resource baseFactor
   * @param {Date} dateOfCreation - Resource date of creation
   * @param {Date} lastUpdate - Resource last update
   * @param {boolean} deleted - Resource deleted
   */
  constructor(
    id,
    name,
    baseFactor,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.baseFactor = baseFactor;
  }
}
