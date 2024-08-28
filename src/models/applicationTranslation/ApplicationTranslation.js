import { Entity } from "../entity/Entity";

/**
 * @class ApplicationTranslation
 * @description Represents a room
 */
export class ApplicationTranslation extends Entity {
  name = "";

  /**
   * @param {number} id - ApplicationTranslation id
   * @param {string} name - ApplicationTranslation name
   * @param {Date} dateOfCreation - ApplicationTranslation date of creation
   * @param {Date} lastUpdate - ApplicationTranslation last update
   * @param {boolean} deleted - ApplicationTranslation deleted
   * @returns ApplicationTranslation instance
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    ApplicationTranslation.className = "applicationTranslation";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {ApplicationTranslation} Entity instance
   */
  static fromJson(json) {
    return new ApplicationTranslation(
      json.id,
      json.name,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
