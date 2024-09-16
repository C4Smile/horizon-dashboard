import { Entity } from "../entity/Entity";

/**
 * @class Language
 * @description Represents a lang
 */
export class Language extends Entity {
  name = "";

  /**
   * @param {number} id - Language id
   * @param {string} name - Language name
   * @param {Date} dateOfCreation - Language date of creation
   * @param {Date} lastUpdate - Language last update
   * @param {boolean} deleted - Language deleted
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    Language.className = "lang";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Language} Entity instance
   */
  static fromJson(json) {
    return new Language(json.id, json.name, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
