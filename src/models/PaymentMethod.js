import { Entity } from "./Entity";

/**
 * @class PaymentMethod
 * @description Represents a paymentMethod
 */
export class PaymentMethod extends Entity {
  name = "";

  /**
   * @param {number} id
   * @param {string} name
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   * @returns {PaymentMethod}
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {PaymentMethod} Entity instance
   */
  static fromJson(json) {
    return new PaymentMethod(json.id, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
