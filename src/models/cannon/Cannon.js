import { Entity } from "../entity/Entity";

/**
 * @class Cannon
 * @description Represents a ship
 */
export class Cannon extends Entity {
  name = "";
  baseDamage = 0;
  weight = 0;
  creationTime = 0;
  urlName = "";
  description = "";

  static className = "cannon";
  static costs = "cannonCosts";
  static techRequirement = "cannonReqTechs";
  static buildingRequirement = "cannonReqBuildings";

  /**
   * @param {number} id - Ship id
   * @param {string} name - Ship name
   * @param {Date} dateOfCreation - Ship date of creation
   * @param {Date} lastUpdate - Ship last update
   * @param {boolean} deleted - Ship deleted
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
