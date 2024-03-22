import { RoomType } from "./RoomType";

import { Entity } from "./Entity";

export const RoomStatus = {
  operational: "operational",
  maintenance: "maintenance",
};

/**
 * @class Room
 * @description Represents a room
 */
export class Room extends Entity {
  number = "";
  name = "";
  type = null;
  status = false;

  /**
   * @param {number} id
   * @param {string} number
   * @param {string} name
   * @param {RoomStatus} status
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   * @returns {Room}
   */
  constructor(
    id,
    number,
    name,
    type,
    status = RoomStatus.free,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.number = number;
    this.name = name;
    this.type = type;
    this.status = status;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {Room} Entity instance
   */
  static fromJson(json) {
    return new Room(
      json.id,
      json.number,
      json.name,
      RoomType.fromJson(json.type),
      json.status,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Number
   */
  get Number() {
    return this.number;
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }

  /**
   * @returns Type
   */
  get Type() {
    return this.type;
  }

  /**
   * @returns Status
   */
  get Status() {
    return this.status;
  }
}
