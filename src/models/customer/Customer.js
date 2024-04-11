import { Country } from "./Country";
import { Entity } from "../entity/Entity";

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
   * @param {number} id - Customer id
   * @param {string} name - Customer name
   * @param {string} email - Customer email
   * @param {string} phone - Customer phone
   * @param {string} address - Customer address
   * @param {string} identification - Customer identification
   * @param {Country} country - Customer country
   * @param {Date} dateOfCreation - Customer date of creation
   * @param {Date} lastUpdate - Customer last update
   * @param {boolean} deleted - Customer deleted
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
   * @param {object} json - JSON representation of the entity
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
