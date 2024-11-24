/**
 * @class Entity
 * @description Base class for all entities
 */
export class Entity {
  static className = "";

  id = 0;
  dateOfCreation = null;
  lastUpdate = null;
  deleted = false;
  lockedBy = 0;

  /**
   * @param {number} id - Entity id
   * @param {Date} dateOfCreation - Entity date of creation
   * @param {Date} lastUpdate - Entity last update
   * @param {boolean} deleted - Entity deleted
   * @returns Entity instance
   */
  constructor(id, dateOfCreation = new Date(), lastUpdate = new Date(), deleted = false) {
    this.id = id;
    this.dateOfCreation = dateOfCreation;
    this.lastUpdate = lastUpdate;
    this.deleted = deleted;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns Entity instance
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
