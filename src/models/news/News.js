import { Entity } from "../entity/Entity";
import { Tag } from "../Tag/Tag";
import { Province } from "../province/Province";
import { Image } from "../image/Image";

/**
 * @class News
 * @description Represents a news
 */
export class News extends Entity {
  title = "";
  description = "";

  /**
   * @param {number} id - News id
   * @param {string} title - News title
   * @param {string} description - News description
   * @param {Province} province - Province
   * @param {Image} photo - News image
   * @param {Tag[]} tags - News tags
   * @param {Date} dateOfCreation - News date of creation
   * @param {Date} lastUpdate - News last update
   * @param {boolean} deleted - News deleted
   */
  constructor(
    id,
    title,
    description,
    province,
    photo,
    tags,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
    this.description = description;
    this.province = province;
    this.photo = photo;
    this.tags = tags;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {News} Entity instance
   */
  static fromJson(json) {
    return new News(json.id, json.title, json.iso, json.dateOfCreation, json.lastUpdate, json.deleted);
  }

  /**
   * @returns Title
   */
  get Title() {
    return this.title;
  }

  /**
   * @returns Description
   */
  get Description() {
    return this.description;
  }

  /**
   * @returns Province
   */
  get Province() {
    return this.province;
  }

  /**
   * @returns Photo
   */
  get Photo() {
    return this.photo;
  }

  /**
   * @returns Tags
   */
  get Tags() {
    return this.tags;
  }
}
