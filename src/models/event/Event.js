import { Entity } from "../entity/Entity";

/**
 * @class Event
 * @description Represents a event
 */
export class Event extends Entity {
  title = "";
  description = "";
  content = "";
  subtitle = "";
  address = "";
  location = "";
  eventHasTag = [];
  eventHasImage = [];
  eventHasLink = [];

  /**
   * @param {number} id - Event id
   * @param {string} title - Event title
   * @param {string} description - Event description
   * @param {string} content - Event content
   * @param {string} subtitle - Event subtitle
   * @param {string} address - Event address
   * @param {string} location - Event location
   * @param {Date} dateOfCreation - Event date of creation
   * @param {Date} lastUpdate - Event last update
   * @param {boolean} deleted - Event deleted
   */
  constructor(
    id,
    title,
    description,
    content,
    subtitle,
    address,
    location,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.title = title;
    this.description = description;
    this.content = content;
    this.subtitle = subtitle;
    this.address = address;
    this.location = location;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
   * @returns {Event} Entity instance
   */
  static fromJson(json) {
    return new Event(
      json.id,
      json.title,
      json.description,
      json.content,
      json.subtitle,
      json.address,
      json.location,
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
   * @returns Content
   */
  get Content() {
    return this.content;
  }

  /**
   * @returns Subtitle
   */
  get Subtitle() {
    return this.subtitle;
  }

  /**
   * @returns Address
   */
  get Address() {
    return this.address;
  }

  /**
   * @returns Location
   */
  get Location() {
    return this.location;
  }
}
