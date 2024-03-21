import { Entity } from "./Entity";

/**
 * @class RoomType
 * @description Represents a room type
 */
export class RoomType extends Entity {
  name = "";
  capacity = 0;
  price = 0;

  /**
   * @param {number} id
   * @param {string} name
   * @param {number} capacity
   * @param {number} price
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   * @returns {RoomType}
   */
  constructor(
    id,
    name,
    capacity,
    price,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.capacity = capacity;
    this.price = price;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {RoomType} Entity instance
   */
  static fromJson(json) {
    return new RoomType(
      json.id,
      json.name,
      json.capacity,
      json.price,
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
