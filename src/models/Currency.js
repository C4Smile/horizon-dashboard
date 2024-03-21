import { Entity } from "./Entity";

/**
 * @class Currency
 * @description Represents a currency
 */
export class Currency extends Entity {
  name = "";
  reduction = "";

  /**
   * @param {number} id
   * @param {string} name
   * @param {string} reduction
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   * @returns {Currency}
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
   * @param {Object} json
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
