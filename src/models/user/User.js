import { Entity } from "../entity/Entity";

/**
 * @class User
 * @description Represents a user
 */
export class User extends Entity {
  image = {};
  username = "";
  password = "";
  name = "";
  email = "";
  phone = "";
  address = "";
  roleId = 0;
  identification = "";

  static className = "user";

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
    id = 0,
    username = "",
    password = "",
    name = "",
    email = "",
    phone = "",
    address = "",
    identification = "",
    dateOfCreation = new Date(),
    lastUpdate = new Date(),
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
}
