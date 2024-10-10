import { Entity } from "../entity/Entity";

/**
 * @class News
 * @description Represents a news
 */
export class News extends Entity {
  title = "";
  subtitle = "";
  content = "";
  newsHasTag = [];
  newsHasImage = [];

  /**
   * @param {number} id - News id
   * @param {string} title - News title
   * @param {string} subtitle - News subtitle
   * @param {string} content - News content
   * @param {Date} dateOfCreation - News date of creation
   * @param {Date} lastUpdate - News last update
   * @param {boolean} deleted - News deleted
   */
  constructor(
    id,
    title,
    subtitle,
    content,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
    this.subtitle = subtitle;
    this.content = content;
    News.className = "news";
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {News} Entity instance
   */
  static fromJson(json) {
    return new News(
      json.id,
      json.title,
      json.subtitle,
      json.content,
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
    return this.subtitle;
  }

  /**
   * @returns Content
   */
  get Content() {
    return this.content;
  }
}
