import { Entity } from "./Entity";

/**
 * @class Currency
 * @description Represents a currency
 */
export class Currency extends Entity {
  name = "";
  reduction = "";

  /**
   * @param {number} id - Currency id
   * @param {string} name - Currency name
   * @param {string} reduction - Currency reduction
   * @param {Date} dateOfCreation - Currency date of creation
   * @param {Date} lastUpdate - Currency last update
   * @param {boolean} deleted - Currency deleted
   * @returns Currency instance
   */
  constructor(
    id,
    name,
    reduction,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.reduction = reduction;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Currency} Entity instance
   */
  static fromJson(json) {
    return new Currency(json.id, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }

  /**
   * @returns Reduction
   */
  get Reduction() {
    return this.reduction;
  }
}
