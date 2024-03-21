import { Entity } from "./Entity";

/**
 * @class Country
 * @description Represents a country
 */
export class Country extends Entity {
  name = "";

  /**
   * @param {number} id
   * @param {string} name
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {Country} Entity instance
   */
  static fromJson(json) {
    return new Country(json.id, json.name, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
