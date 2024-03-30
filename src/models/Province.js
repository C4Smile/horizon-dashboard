import { Entity } from "./Entity";
import { Country } from "./Country";

/**
 * @class Province
 * @description Represents a province
 */
export class Province extends Entity {
  name = "";
  iso = "";

  /**
   * @param {number} id - Province id
   * @param {string} name - Province name
   * @param {Country} country - Province country
   * @param {Date} dateOfCreation - Province date of creation
   * @param {Date} lastUpdate - Province last update
   * @param {boolean} deleted - Province deleted
   */
  constructor(
    id,
    name,
    country,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.country = country;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Province} Entity instance
   */
  static fromJson(json) {
    return new Province(
      json.id,
      json.name,
      json.country,
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
   * @returns Country
   */
  get Country() {
    return this.country;
  }
}
