import { Customer } from "./Customer";
import { Entity } from "./Entity";

export const ReservationStatus = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
};

/**
 * @class Reservation
 * @description Represents a reservation
 */
export class Reservation extends Entity {
  customer = null;
  checkInDate = null;
  checkOutDate = null;
  status = ReservationStatus.pending;
  ticket = "";

  /**
   * @param {number} id
   * @param {Customer} customer
   * @param {Date} checkInDate
   * @param {Date} checkOutDate
   * @param {ReservationStatus} status
   * @param {string} ticket
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   * @returns {Reservation}
   */
  constructor(
    id,
    customer,
    checkInDate,
    checkOutDate,
    status,
    ticket,
    dateOfCreation = Date.now(),
    lastUpdate = Date.now(),
    deleted = false,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.customer = customer;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.status = status;
    this.ticket = ticket;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {Object} json
   * @returns {Reservation} Entity instance
   */
  static fromJson(json) {
    return new Reservation(
      json.id,
      Customer.fromJson(json.customer),
      json.checkInDate,
      json.checkOutDate,
      json.status,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Customer
   */
  get Customer() {
    return this.customer;
  }

  /**
   * @returns CheckInDate
   */
  get CheckInDate() {
    return this.checkInDate;
  }

  /**
   * @returns CheckOutDate
   */
  get CheckOutDate() {
    return this.checkOutDate;
  }

  /**
   * @returns Status
   */
  get Status() {
    return this.status;
  }

  /**
   * @returns Ticket
   */
  get Ticket() {
    return this.ticket;
  }
}
