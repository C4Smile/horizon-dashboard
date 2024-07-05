import { Entity } from "../entity/Entity";

/**
 * @class Service
 * @description Represents a tag
 */
export class Service extends Entity {
  name = "";
  description = "";
  imageId = 0;
  servicePlace = [];
  serviceHasSchedule = [];

  /**
   * @param {number} id - Service id
   * @param {string} name - Service name
   * @param {string} description - Service description
   * @param {Date} dateOfCreation - Service date of creation
   * @param {Date} lastUpdate - Service last update
   * @param {boolean} deleted - Service deleted
   */
  constructor(
    id,
    name,
    description,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.name = name;
    this.description = description;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Service} Entity instance
   */
  static fromJson(json) {
    return new Service(
      json.id,
      json.name,
      json.description,
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

  /**
   * @returns Description
   */
  get Description() {
    return this.description;
  }
}
