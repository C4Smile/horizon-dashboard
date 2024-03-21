import { Country } from "./Country";
import { Entity } from "./Entity";

/**
 * @class Customer
 * @description Represents a customer
 */
export class Customer extends Entity {
  name = "";
  email = "";
  phone = "";
  address = "";
  identification = "";
  country = null;

  /**
   * @param {number} id
   * @param {string} name
   * @param {string} email
   * @param {string} phone
   * @param {string} address
   * @param {string} identification
   * @param {Country} country
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   */
  constructor(
    id,
    name,
    email,
    phone,
    address,
    identification,
    country,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.country = country;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.identification = identification;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {Customer} Entity instance
   */
  static fromJson(json) {
    return new Customer(
      json.id,
      json.name,
      json.email,
      json.phone,
      json.address,
      json.identification,
      Country.fromJson(json.country),
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

  /**
   * @returns Country
   */
  get Country() {
    return this.country;
  }
}
