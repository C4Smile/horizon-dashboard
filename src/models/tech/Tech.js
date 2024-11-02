import { Entity } from "../entity/Entity";

/**
 * @class Tech
 * @description Represents a tech
 */
export class Tech extends Entity {
  name = "";
  imageId = 0;
  typeId = 0;
  creationTime = 0;

  static className = "tech";
  static costs = "techCost";
  static production = "techProduction";

  /**
   * @param {number} id - Tech id
   * @param {string} name - Tech name
   * @param {number} creationTime - Tech creation time
   * @param {Date} dateOfCreation - Tech date of creation
   * @param {Date} lastUpdate - Tech last update
   * @param {boolean} deleted - Tech deleted
   */
  constructor(
    id,
    name,
    creationTime,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.creationTime = creationTime;
  }
}
