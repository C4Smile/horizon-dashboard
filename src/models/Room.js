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
  status = false;

  /**
   * @param {number} id - Room id
   * @param {string} number - Room number
   * @param {string} name - Room name
   * @param {RoomStatus} status - Room status
   * @param {Date} dateOfCreation - Room date of creation
   * @param {Date} lastUpdate - Room last update
   * @param {boolean} deleted - Room deleted
   * @returns Room instance
   */
  constructor(
    id,
    number,
    name,
    status = RoomStatus.free,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.number = number;
    this.name = name;
    this.status = status;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Room} Entity instance
   */
  static fromJson(json) {
    return new Room(
      json.id,
      json.number,
      json.name,
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
   * @returns Status
   */
  get Status() {
    return this.status;
  }
}
