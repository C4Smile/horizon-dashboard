import { Entity } from "../entity/Entity";

/**
 * @class Building
 * @description Represents a building
 */
export class Building extends Entity {
  name = "";
  urlName = "";
  description = "";
  creationTime = 0;
  type = 0;
  image = {};

  static className = "building";
  static costs = "buildingCosts";
  static upkeeps = "buildingUpkeeps";
  static resourceUpgrade = "buildingProduces";
  static techRequirement = "buildingReqTechs";
  static buildingRequirement = "buildingReqBuildings";

  /**
   * @param {number} id - Building id
   * @param {string} name - Building name
   * @param {Date} dateOfCreation - Building date of creation
   * @param {Date} lastUpdate - Building last update
   * @param {boolean} deleted - Building deleted
   */
  constructor(
    id = 0,
    name = "",
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }
}
