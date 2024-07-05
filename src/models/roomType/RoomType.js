import { Entity } from "../entity/Entity";

/**
 * @class RoomType
 * @description Represents a room
 */
export class RoomType extends Entity {
  name = "";
  price = 0;
  capacity = 0;

  /**
   * @param {string} name - RoomType name
   * @param {number} price - RoomType price
   * @param {number} capacity - RoomType capacity
   * @param {Date} dateOfCreation - RoomType date of creation
   * @param {Date} lastUpdate - RoomType last update
   * @param {boolean} deleted - RoomType deleted
   * @returns RoomType instance
   */
  constructor(
    id,
    name,
    price,
    capacity,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.price = price;
    this.capacity = capacity;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {RoomType} Entity instance
   */
  static fromJson(json) {
    return new RoomType(
      json.id,
      json.name,
      json.price,
      json.capacity,
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
   * @returns Price
   */
  get Price() {
    return this.price;
  }

  /**
   * @returns Capacity
   */
  get Capacity() {
    return this.capacity;
  }
}
