import { Entity } from "./Entity";

/**
 * @class PaymentMethod
 * @description Represents a paymentMethod
 */
export class PaymentMethod extends Entity {
  name = "";

  /**
   * @param {number} id - PaymentMethod id
   * @param {string} name - PaymentMethod name
   * @param {Date} dateOfCreation - PaymentMethod date of creation
   * @param {Date} lastUpdate - PaymentMethod last update
   * @param {boolean} deleted - PaymentMethod deleted
   * @returns PaymentMethod instance
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
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
