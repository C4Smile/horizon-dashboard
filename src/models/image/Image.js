import { Entity } from "../entity/Entity";

/**
 * @class Image
 * @description Represents an image
 */
export class Image extends Entity {
  fileName = "";
  url = "";

  /**
   *
   * @param {number} id - Image id
   * @param {string} fileName - Image file name
   * @param {string} url - Image url
   * @param {Date} dateOfCreation - Image date of creation
   * @param {Date} lastUpdate - Image last update
   * @param {boolean} deleted - Image deleted
   */
  constructor(
    id,
    fileName,
    url,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.fileName = fileName;
    this.url = url;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Image} Entity instance
   */
  static fromJson(json) {
    return new Image(
      json.id,
      json.fileName,
      json.url,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns FileName
   */
  get FileName() {
    return this.fileName;
  }

  /**
   * @returns Url
   */
  get Url() {
    return this.url;
  }
}
