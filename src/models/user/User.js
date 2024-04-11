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
   * @param {number} id - user id
   * @param {string} username - username
   * @param {string} password - user password
   * @param {string} name - user name
   * @param {string} email - user email
   * @param {string} phone - user phone
   * @param {string} address - user address
   * @param {string} identification - user identification
   * @param {Date} dateOfCreation - user date of creation
   * @param {Date} lastUpdate - user last update
   * @param {boolean} deleted - user deleted
   */
  constructor(
    id,
    username,
    password,
    name,
    email,
    phone,
    address,
    identification,
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
    this.address = address;
    this.identification = identification;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {object} json - JSON representation of the entity
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
      json.address,
      json.identification,
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

  /**
   * @returns Address
   */
  get Address() {
    return this.address;
  }

  /**
   * @returns Identification
   */
  get Identification() {
    return this.identification;
  }
}
