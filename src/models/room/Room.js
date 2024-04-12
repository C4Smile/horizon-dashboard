import { Entity } from "../entity/Entity";

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
  description = "";
  status = RoomStatus.operational;

  /**
   * @param {number} id - Room id
   * @param {string} number - Room number
   * @param {string} name - Room name
   * @param {string} description - Room description
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
    description,
    status = RoomStatus.operational,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.number = number;
    this.name = name;
    this.description = description;
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
      json.description,
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
   * @returns Description
   */
  get Description() {
    return this.description;
  }

  /**
   * @returns Status
   */
  get Status() {
    return this.status;
  }
}
