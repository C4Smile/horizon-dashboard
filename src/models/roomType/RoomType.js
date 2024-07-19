import { Entity } from "../entity/Entity";

/**
 * @class RoomType
 * @description Represents a room
 */
export class RoomType extends Entity {
  name = "";

  /**
   * @param {number} id - RoomType id
   * @param {string} name - RoomType name
   * @param {Date} dateOfCreation - RoomType date of creation
   * @param {Date} lastUpdate - RoomType last update
   * @param {boolean} deleted - RoomType deleted
   * @returns RoomType instance
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {RoomType} Entity instance
   */
  static fromJson(json) {
    return new RoomType(json.id, json.name, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
