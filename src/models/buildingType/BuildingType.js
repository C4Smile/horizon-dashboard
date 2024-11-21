import { Entity } from "../entity/Entity";

/**
 * @class BuildingType
 * @description Represents a buildingType
 */
export class BuildingType extends Entity {
  name = "";
  urlName = "";
  image = {};

  /**
   * @param {number} id - BuildingType id
   * @param {string} name - BuildingType name
   * @param {Date} dateOfCreation - BuildingType date of creation
   * @param {Date} lastUpdate - BuildingType last update
   * @param {boolean} deleted - BuildingType deleted
   */
  constructor(id, name, dateOfCreation = new Date(), lastUpdate = new Date(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    BuildingType.className = "buildingType";
  }
}
