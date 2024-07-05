import { Entity } from "../entity/Entity";

/**
 * @class Room
 * @description Represents a room
 */
export class Room extends Entity {
  number = "";
  type = 0;
  status = 0;
  roomHasImage = [];
  image360Id = 0;
  content = "";

  /**
   * @param {number} id - Room id
   * @param {string} number - Room number
   * @param {RoomStatus} status - Room status
   * @param {Date} dateOfCreation - Room date of creation
   * @param {Date} lastUpdate - Room last update
   * @param {boolean} deleted - Room deleted
   * @returns Room instance
   */
  constructor(
    id,
    number,
    status = 0,
    content = "",
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.content = content;
    this.number = number;
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
      json.status,
      json.content,
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
   * @returns Status
   */
  get Status() {
    return this.status;
  }

  /**
   * @returns Content
   */
  get Content() {
    return this.content;
  }
}
