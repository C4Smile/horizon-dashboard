import { Entity } from "../entity/Entity";

/**
 * @class Building
 * @description Represents a building
 */
export class Building extends Entity {
  name = "";
  urlName = "";
  description = "";
  imageId = 0;
  baseFactor = 0;
  baseUpkeep = 0;

  static className = "building";
  static costs = "buildingCosts";
  static resourceUpgrade = "buildingProduces";
  static techRequirement = "buildingReqTechs";
  static buildingRequirement = "buildingReqBuildings";

  /**
   * @param {number} id - Building id
   * @param {string} name - Building name
   * @param {number} baseFactor - Building baseFactor
   * @param {number} baseUpkeep - Building baseUpkeep
   * @param {Date} dateOfCreation - Building date of creation
   * @param {Date} lastUpdate - Building last update
   * @param {boolean} deleted - Building deleted
   */
  constructor(
    id,
    name,
    baseFactor,
    baseUpkeep,
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.baseFactor = baseFactor;
    this.baseUpkeep = baseUpkeep;
  }
}
