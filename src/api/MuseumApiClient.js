import { CustomerApiClient } from "./CustomerApiClient";
import { ReservationApiClient } from "./ReservationApiClient";
import { InvoiceApiClient } from "./InvoiceApiClient";
import { CountryApiClient } from "./CountryApiClient";
import { ProvinceApiClient } from "./ProvinceApiClient";
import { RoomApiClient } from "./RoomApiClient";
import { UserApiClient } from "./UserApiClient";
import { CurrencyApiClient } from "./CurrencyApiClient";
import { PaymentMethodApiClient } from "./PaymentMethodApiClient";

/**
 * @class MuseumApiClient
 * @description MuseumApiClient
 */
export class MuseumApiClient {
  /**
   * @description constructor
   */
  constructor() {
    this.user = new UserApiClient();
    this.customer = new CustomerApiClient();
    this.reservation = new ReservationApiClient();
    this.invoice = new InvoiceApiClient();
    this.country = new CountryApiClient();
    this.province = new ProvinceApiClient();
    this.room = new RoomApiClient();
    this.currency = new CurrencyApiClient();
    this.paymentMethod = new PaymentMethodApiClient();
  }

  /**
   * @returns {PaymentMethodApiClient} Currency
   */
  get PaymentMethod() {
    return this.paymentMethod;
  }

  /**
   * @returns {CurrencyApiClient} Currency
   */
  get Currency() {
    return this.currency;
  }

  /**
   * @returns {UserApiClient} Customer
   */
  get User() {
    return this.user;
  }

  /**
   * @returns {CustomerApiClient} Customer
   */
  get Customer() {
    return this.customer;
  }

  /**
   * @returns {RoomApiClient} Room
   */
  get Room() {
    return this.room;
  }

  /**
   * @returns {CountryApiClient} Country
   */
  get Country() {
    return this.country;
  }

  /**
   * @returns {ProvinceApiClient} Province
   */
  get Province() {
    return this.province;
  }

  /**
   * @returns {ReservationApiClient} Reservation
   */
  get Reservation() {
    return this.reservation;
  }

  /**
   * @returns {InvoiceApiClient} Invoice
   */
  get Invoice() {
    return this.invoice;
  }
}
