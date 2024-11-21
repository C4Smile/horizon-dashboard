import { Entity } from "../entity/Entity";

/**
 * @class Tech
 * @description Represents a tech
 */
export class Tech extends Entity {
  name = "";
  description = "";
  urlName = "";
  image = {};
  type = 0;
  creationTime = 0;

  static className = "tech";
  static costs = "techCosts";
  static resourceUpgrade = "techProduces";
  static techRequirement = "techReqTechs";
  static buildingRequirement = "techReqBuildings";

  /**
   * @param {number} id - Tech id
   * @param {string} name - Tech name
   * @param {number} creationTime - Tech creation time
   * @param {Date} dateOfCreation - Tech date of creation
   * @param {Date} lastUpdate - Tech last update
   * @param {boolean} deleted - Tech deleted
   */
  constructor(
    id = 0,
    name = "",
    creationTime = 0,
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.creationTime = creationTime;
  }
}
