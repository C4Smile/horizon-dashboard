import { Entity } from "./Entity";

/**
 * @class Country
 * @description Represents a country
 */
export class Country extends Entity {
  name = "";
  iso = "";

  /**
   * @param {number} id - Country id
   * @param {string} name - Country name
   * @param {string} iso - Country iso
   * @param {Date} dateOfCreation - Country date of creation
   * @param {Date} lastUpdate - Country last update
   * @param {boolean} deleted - Country deleted
   */
  constructor(id, name, iso, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.iso = iso;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Country} Entity instance
   */
  static fromJson(json) {
    return new Country(
      json.id,
      json.name,
      json.iso,
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

  /**
   * @returns ISO
   */
  get Iso() {
    return this.iso;
  }
}
