import { Entity } from "../entity/Entity";

/**
 * @class RoomArea
 * @description Represents a RoomArea
 */
export class RoomArea extends Entity {
  name = "";
  status = 0;
  content = "";
  roomId = 0;
  description = "";
  roomAreaHasImage = [];
  roomAreaHasImage360 = [];

  /**
   * @param {number} id - RoomArea id
   * @param {string} name - RoomArea name
   * @param {number} status - Room status
   * @param {string} description - Room description
   * @param {string} content - Room content
   * @param {Date} dateOfCreation - RoomArea date of creation
   * @param {Date} lastUpdate - RoomArea last update
   * @param {boolean} deleted - RoomArea deleted
   */
  constructor(
    id,
    name,
    status = 0,
    description = "",
    content = "",
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.content = content;
    this.description = description;
    this.status = status;
    RoomArea.className = "roomArea";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {RoomArea} Entity instance
   */
  static fromJson(json) {
    return new RoomArea(
      json.id,
      json.name,
      json.status,
      json.description,
      json.content,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }
}
