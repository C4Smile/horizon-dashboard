import { Entity } from "../entity/Entity";

/**
 * @class GuestBook
 * @description Represents a GuestBook
 */
export class GuestBook extends Entity {
  name = "";
  content = "";
  description = "";
  guestBookHasImage = [];

  /**
   * @param {number} id - GuestBook id
   * @param {string} name - GuestBook name
   * @param {string} description - Room description
   * @param {string} content - Room content
   * @param {Date} dateOfCreation - GuestBook date of creation
   * @param {Date} lastUpdate - GuestBook last update
   * @param {boolean} deleted - GuestBook deleted
   */
  constructor(
    id,
    name,
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
    GuestBook.className = "guestBook";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {GuestBook} Entity instance
   */
  static fromJson(json) {
    return new GuestBook(
      json.id,
      json.name,
      json.description,
      json.content,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }
}
