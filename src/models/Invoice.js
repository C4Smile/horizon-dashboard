import { Customer } from "./Customer";
import { Reservation } from "./Reservation";
import { Entity } from "./Entity";
import { Currency } from "./Currency";
import { PaymentMethod } from "./PaymentMethod";

/**
 * @class Invoice
 * @description Represents an invoice
 */
export class Invoice extends Entity {
  reservation = null;
  customer = null;
  currency = null;
  dateIssued = null;
  totalAmount = 0;
  paymentMethod = null;

  /**
   * @param {number} id
   * @param {Reservation} reservation
   * @param {Customer} customer
   * @param {Currency} currency
   * @param {PaymentMethod} paymentMethod
   * @param {Date} dateIssued
   * @param {number} totalAmount
   * @param {Date} dateOfCreation
   * @param {Date} lastUpdate
   * @param {boolean} deleted
   */
  constructor(
    id,
    reservation,
    customer,
    currency,
    paymentMethod,
    dateIssued,
    totalAmount,
    dateOfCreation,
    lastUpdate,
    deleted,
  ) {
    super(id, dateOfCreation, lastUpdate, deleted);
    this.reservation = reservation;
    this.customer = customer;
    this.currency = currency;
    this.paymentMethod = paymentMethod;
    this.dateIssued = dateIssued;
    this.totalAmount = totalAmount;
  }

  /**
   * @description Returns a JSON representation of the entity
   * @param {*} json
   * @returns
   */
  static fromJson(json) {
    return new Invoice(
      json.id,
      Reservation.fromJson(json.reservation),
      Customer.fromJson(json.customer),
      Currency.fromJson(json.currency),
      PaymentMethod.fromJson(json.paymentMethod),
      json.dateIssued,
      json.totalAmount,
      json.dateOfCreation,
      json.lastUpdate,
      json.deleted,
    );
  }

  /**
   * @returns Reservation
   */
  get Reservation() {
    return this.reservation;
  }

  /**
   * @returns Customer
   */
  get Customer() {
    return this.customer;
  }

  /**
   * @returns Currency
   */
  get Currency() {
    return this.currency;
  }

  /**
   * @returns PaymentMethod
   */
  get PaymentMethod() {
    return this.paymentMethod;
  }

  /**
   * @returns DateIssued
   */
  get DateIssued() {
    return this.dateIssued;
  }

  /**
   * @returns TotalAmount
   */
  get TotalAmount() {
    return this.totalAmount;
  }
}
