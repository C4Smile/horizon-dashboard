import { Entity } from "../entity/Entity";

/**
 * @class TechType
 * @description Represents a techType
 */
export class TechType extends Entity {
  name = "";
  imageId = 0;

  /**
   * @param {number} id - TechType id
   * @param {string} name - TechType name
   * @param {Date} dateOfCreation - TechType date of creation
   * @param {Date} lastUpdate - TechType last update
   * @param {boolean} deleted - TechType deleted
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    TechType.className = "techType";
  }
}
