import { Entity } from "../entity/Entity";

/**
 * @class AppText
 * @description Represents a appText
 */
export class AppText extends Entity {
  title = "";

  /**
   * @param {number} id - AppText id
   * @param {string} title - AppText title
   * @param {Date} dateOfCreation - AppText date of creation
   * @param {Date} lastUpdate - AppText last update
   * @param {boolean} deleted - AppText deleted
   */
  constructor(id, title, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {AppText} Entity instance
   */
  static fromJson(json) {
    return new AppText(json.id, json.title, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.title;
  }
}
