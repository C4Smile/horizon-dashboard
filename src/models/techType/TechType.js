import { Entity } from "../entity/Entity";

/**
 * @class TechType
 * @description Represents a techType
 */
export class TechType extends Entity {
  name = "";
  urlName = "";
  image = {};

  /**
   * @param {number} id - TechType id
   * @param {string} name - TechType name
   * @param {Date} dateOfCreation - TechType date of creation
   * @param {Date} lastUpdate - TechType last update
   * @param {boolean} deleted - TechType deleted
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
    TechType.className = "techType";
  }
}
