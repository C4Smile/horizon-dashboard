/**
 * @class Entity
 * @description Base class for all entities
 */
export class Entity {
  id = 0;
  dateOfCreation = null;
  lastUpdate = null;
  deleted = false;

  /**
   * @param {number} id
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   * @returns {Entity}
   */
  constructor(id, dateOfCreation = Date.now(), lastUpdate = Date.now(), deleted = false) {
    this.id = id;
    this.dateOfCreation = dateOfCreation;
    this.lastUpdate = lastUpdate;
    this.deleted = deleted;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {Entity} Entity instance
   */
  static fromJson(json) {
    return new Entity(json.id, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Id
   */
  get Id() {
    return this.id;
  }

  /**
   * @returns DateOfCreation
   */
  get DateOfCreation() {
    return this.dateOfCreation;
  }

  /**
   * @returns LastUpdate
   */
  get LastUpdate() {
    return this.lastUpdate;
  }

  /**
   * @returns Deleted
   */
  get Deleted() {
    return this.deleted;
  }
}
