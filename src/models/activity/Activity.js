import { Entity } from "../entity/Entity";

/**
 * @class Activity
 * @description Represents a news
 */
export class Activity extends Entity {
  title = "";
  description = "";
  imageId = 0;
  entity = "";

  /**
   * @param {number} id - Activity id
   * @param {string} title - Activity title
   * @param {string} description - Activity description
   * @param {string} entity - Activity entity
   * @param {Date} dateOfCreation - Activity date of creation
   * @param {Date} lastUpdate - Activity last update
   * @param {boolean} deleted - Activity deleted
   */
  constructor(
    id,
    title,
    description,
    entity,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
    this.description = description;
    this.entity = entity;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Activity} Entity instance
   */
  static fromJson(json) {
    return new Activity(
      json.id,
      json.title,
      json.description,
      json.entity,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Title
   */
  get Title() {
    return this.title;
  }

  /**
   * @returns ISO
   */
  get Description() {
    return this.description;
  }

  /**
   * @returns Entity
   */
  get Entity() {
    return this.entity;
  }
}
