import { Entity } from "../entity/Entity";

/**
 * @class Application
 * @description Represents a room
 */
export class Application extends Entity {
  name = "";

  /**
   * @param {number} id - Application id
   * @param {string} name - Application name
   * @param {Date} dateOfCreation - Application date of creation
   * @param {Date} lastUpdate - Application last update
   * @param {boolean} deleted - Application deleted
   * @returns Application instance
   */
  constructor(id, name, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    Application.className = "application";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Application} Entity instance
   */
  static fromJson(json) {
    return new Application(json.id, json.name, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Name
   */
  get Name() {
    return this.name;
  }
}
