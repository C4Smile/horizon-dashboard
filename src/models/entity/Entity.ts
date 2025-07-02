/**
 * @class Entity
 * @description Base class for all entities
 */
export class Entity {
  static className = "";

  id = 0;
  dateOfCreation: Date;
  lastUpdate: Date;
  deleted = false;
  lockedBy = 0;

  /**
   * @param id - Entity id
   * @param dateOfCreation - Entity date of creation
   * @param lastUpdate - Entity last update
   * @param deleted - Entity deleted
   * @returns Entity instance
   */
  constructor(
    id: number,
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
    deleted = false
  ) {
    this.id = id;
    this.dateOfCreation = dateOfCreation;
    this.lastUpdate = lastUpdate;
    this.deleted = deleted;
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
