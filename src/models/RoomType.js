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
   * @param {number} id - Room type id
   * @param {string} name - Room type name
   * @param {number} capacity - Room type capacity
   * @param {number} price - Room type price
   * @param {Date} dateOfCreation - Room type date of creation
   * @param {Date} lastUpdate - Room type last update
   * @param {boolean} deleted - Room type deleted
   * @returns Room type instance
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
   * @param {object} json - JSON representation of the entity
   * @returns Entity instance
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
