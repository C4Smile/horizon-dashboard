import { Entity } from "./Entity";

/**
 * @class User
 * @description Represents a user
 */
export class User extends Entity {
  username = "";
  password = "";
  name = "";
  email = "";
  phone = "";

  /**
   * @param {number} id
   * @param {string} username
   * @param {string} password
   * @param {string} name
   * @param {string} email
   * @param {string} phone
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   */
  constructor(
    id,
    username,
    password,
    name,
    email,
    phone,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.username = username;
    this.password = password;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {User} Entity instance
   */
  static fromJson(json) {
    return new User(
      json.id,
      json.username,
      json.password,
      json.name,
      json.email,
      json.phone,
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
   * @returns Email
   */
  get Email() {
    return this.email;
  }

  /**
   * @returns Username
   */
  get Username() {
    return this.username;
  }

  /**
   * @returns Password
   */
  get Password() {
    return this.password;
  }

  /**
   * @returns Phone
   */
  get Phone() {
    return this.phone;
  }
}
